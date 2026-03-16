export const MARKER_REGEX = /^CG-[A-Za-z0-9]{6}$/

export function validateMarkerId(id: string): boolean {
  return MARKER_REGEX.test(id)
}

/**
 * Extracts a CG-XXXXXX marker ID from a raw QR scan string.
 * Handles both bare IDs and full URLs like https://theconfidential.gallery/scan/CG-ABC123
 */
export function extractMarkerId(text: string): string | null {
  const trimmed = text.trim()
  if (validateMarkerId(trimmed)) return trimmed
  const match = trimmed.match(/\/scan\/(CG-[A-Za-z0-9]{6})/)
  if (match) return match[1]
  return null
}

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

export function generateMarkerId(): string {
  let id = 'CG-'
  for (let i = 0; i < 6; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}
