# The Confidential Gallery

An invite-only digital platform bridging the physical and digital art world — connecting artists and curators through a private, curated space for discovery, collaboration, and direct communication.

## Overview

The Confidential Gallery enables artists to showcase work, build trusted curator networks, and manage their presence, while curators discover and collect artworks — including scanning physical QR markers in real galleries to access digital experiences.

## Features

- **Invite-only access** with waitlist and referral system
- **Artist profiles** — portfolio management, process media, availability for commissions
- **Curator profiles** — interests, institution, personal collection
- **Artwork marketplace** — listings with pricing and enquiry flow
- **AR previews** — augmented reality artwork viewer
- **QR / NFC marker scanning** — scan physical gallery markers (format: `MG-XXXXXX`) to pull up artwork details and digital layers
- **Claude Vision AI** — automatic artwork identification via the `/api/identify-artwork` endpoint
- **Direct messaging** — artist ↔ curator conversations
- **Artist analytics** — scan events, connections, audience location data
- **Events listings**
- **PWA / offline support** via service worker
- **Dark / light theme**

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude (Vision / artwork ID) |
| QR Scanning | html5-qrcode |

## Project Structure

```
app/                   # Next.js App Router pages & API routes
├── account/           # User account management
├── admin/             # Gallery admin dashboard
├── artists/           # Artist directory & profiles
├── ar-preview/        # AR artwork viewer
├── events/            # Events listings
├── marketplace/       # Artwork marketplace
├── scan/              # QR/NFC scanner & marker pages
└── api/
    └── identify-artwork/  # Claude Vision endpoint

components/            # Shared React components
lib/
├── api/               # Data fetching (artworks, galleries, exhibitions, analytics)
├── auth/              # Auth context provider
├── hooks/             # useArtwork, useScanner, useOffline
└── utils/             # Marker ID helpers, storage

supabase/
└── migrations/        # Database schema (SQL)

public/                # Static assets
```

## Database Schema

Core tables managed via Supabase migrations:

- `profiles` — all users (artist or curator account type)
- `artist_profiles` / `curator_profiles` — role-specific data
- `galleries` / `exhibitions` — gallery and show management
- `artworks` / `artwork_assets` — artwork records and media
- `artwork_previews` — private WIP previews with visibility control
- `curator_list_members` — per-artist trusted curator lists
- `markers` — QR/NFC physical marker registry
- `scan_events` — analytics tracking
- `conversations` / `messages` — direct messaging
- `admin_users` — gallery staff with roles (owner, editor, viewer)

Row-level security (RLS) is enforced throughout.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com) (for artwork identification)

### Installation

```bash
git clone <repo-url>
cd MetaGallerySite
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anon/public key
ADMIN_SECRET=                     # Server-side admin authentication secret
ANTHROPIC_API_KEY=                # Claude API key for artwork identification
```

### Database Setup

Apply migrations in order using the Supabase CLI or the Supabase dashboard SQL editor:

```bash
supabase db push
```

Or run migrations manually from `supabase/migrations/`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## User Roles

| Role | Capabilities |
|---|---|
| **Artist** | Upload artworks, manage curator lists, send/receive messages, view analytics |
| **Curator** | Discover artworks, scan gallery markers, message artists, manage collection |
| **Admin** | Manage gallery content, exhibitions, markers, and staff roles |

## Key Routes

| Route | Description |
|---|---|
| `/` | Home / landing |
| `/marketplace` | Artwork listings |
| `/artists` | Artist directory |
| `/scan` | QR code scanner |
| `/scan/[markerId]` | Marker detail & AR trigger |
| `/ar-preview` | AR viewer |
| `/account` | User account & settings |
| `/admin` | Gallery admin dashboard |
| `/events` | Events listings |
