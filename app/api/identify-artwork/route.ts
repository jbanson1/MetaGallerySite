import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Strip the data URL prefix if present
    const base64 = image.replace(/^data:image\/\w+;base64,/, '')

    // Fetch all active artworks with their markers
    const { data: artworks, error: dbError } = await supabase
      .from('artworks')
      .select('id, title, artist_name, markers(marker_id)')
      .eq('is_active', true)

    if (dbError) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const artworkList = (artworks ?? []).map((a, i) => ({
      index: i,
      id: a.id,
      title: a.title,
      artist: a.artist_name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      markerId: (a as any).markers?.[0]?.marker_id ?? null,
    }))

    const listText = artworkList.length > 0
      ? artworkList.map((a) => `${a.index + 1}. "${a.title}" by ${a.artist}`).join('\n')
      : '(no artworks in database)'

    const prompt = `You are an art identification assistant for Confidential Gallery.

A visitor has taken a photo and wants to identify the painting in front of them.

Gallery artworks currently on display:
${listText}

Examine the photo carefully. If the image clearly shows a painting or artwork:

1. If it matches one of the gallery artworks listed above, respond with this exact JSON:
{"matched":true,"index":<0-based index>,"confidence":"high"}

2. If it is a painting/artwork NOT in the gallery list, respond with:
{"matched":false,"title":"<title or brief description>","artist":"<artist name or Unknown>"}

3. If no painting is clearly visible, respond with:
{"matched":false,"title":null,"artist":null}

Respond ONLY with the JSON — no other text.`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64,
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

    let parsed: { matched: boolean; index?: number; confidence?: string; title?: string | null; artist?: string | null }
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Could not parse AI response', raw }, { status: 500 })
    }

    if (parsed.matched && typeof parsed.index === 'number') {
      const match = artworkList[parsed.index]
      if (match) {
        return NextResponse.json({
          found: true,
          markerId: match.markerId,
          artworkId: match.id,
          title: match.title,
          artist: match.artist,
          confidence: parsed.confidence ?? 'medium',
        })
      }
    }

    // Not in gallery — return whatever Claude identified
    return NextResponse.json({
      found: false,
      title: parsed.title ?? null,
      artist: parsed.artist ?? null,
    })
  } catch (err) {
    console.error('[identify-artwork]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
