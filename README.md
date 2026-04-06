# HAM STUDIO — Roblox Audio Converter

Full-stack Next.js 14 app to convert audio from YouTube/SoundCloud and upload directly to Roblox via Open Cloud API.

---

## ✅ Features Implemented

- **Discord OAuth login** via NextAuth.js
- **Discord guild membership gate** — users must join your server
- **Roblox API key management** — AES-256-GCM encrypted storage
- **Audio conversion** — yt-dlp download + ffmpeg processing (speed, amplify, duration)
- **Roblox Open Cloud upload** — direct asset upload with operation polling
- **Moderation status sync** — auto-checks PENDING → ACCEPTED / REJECTED
- **Rate limiting** — Free plan: 2/hour; Premium: unlimited
- **Conversion history** — paginated table with delete, copy asset ID
- **Personal + Group Roblox accounts** — switchable
- **Protected routes** — Next.js middleware redirects unauthenticated users

---

## 🚀 Deploy to Vercel in 5 Steps

### Step 1 — Create PostgreSQL Database (free)
Go to [neon.tech](https://neon.tech) → New Project → Copy the connection string.

### Step 2 — Create Discord OAuth App
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. New Application → OAuth2 → Add Redirect:
   ```
   https://YOUR-DOMAIN.vercel.app/api/auth/callback/discord
   ```
3. Copy **Client ID** and **Client Secret**

### Step 3 — (Optional) Create Discord Bot for guild checks
1. In your Discord app → Bot → Reset Token → Copy token
2. Invite bot to your server with `Read Members` permission
3. Enable Developer Mode in Discord → Right-click server → Copy Server ID

### Step 4 — Push to GitHub and import in Vercel
```bash
git init
git add .
git commit -m "initial commit"
gh repo create ham-studio --private --push
```
Then: [vercel.com](https://vercel.com) → New Project → Import → Deploy

### Step 5 — Set Environment Variables in Vercel

Go to Project → Settings → Environment Variables and add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon/Supabase PostgreSQL URL |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `DISCORD_CLIENT_ID` | From Discord app |
| `DISCORD_CLIENT_SECRET` | From Discord app |
| `DISCORD_GUILD_ID` | Your server ID |
| `DISCORD_BOT_TOKEN` | Your bot token |
| `ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `REQUIRE_DISCORD_GUILD` | `true` |
| `NEXT_PUBLIC_DISCORD_INVITE` | Your invite link |

### Step 6 — Run Database Migration
After first deploy, run in Vercel's function terminal or locally with `DATABASE_URL` set:
```bash
npx prisma migrate dev --name init
```
Or push schema directly:
```bash
npx prisma db push
```

---

## 🖥️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Set up database
npx prisma db push

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
cenz-studio/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── verify-guild/route.ts   # Discord guild check
│   │   ├── convert/
│   │   │   ├── route.ts                # POST: start conversion
│   │   │   └── [jobId]/route.ts        # GET: poll job status
│   │   ├── history/route.ts            # GET/DELETE: conversion history
│   │   ├── roblox/route.ts             # GET/POST/DELETE: Roblox creds
│   │   └── user/stats/route.ts         # GET: dashboard stats
│   ├── login/page.tsx                  # Login page
│   ├── join-discord/page.tsx           # Guild gate page
│   ├── page.tsx                        # Main dashboard
│   ├── layout.tsx                      # Root layout + SessionProvider
│   └── globals.css                     # Cyber theme styles
├── components/
│   ├── Header.tsx                      # Sticky nav + user menu
│   ├── StatsCards.tsx                  # 4 stat cards
│   ├── ConvertAudio.tsx                # Conversion form + job polling
│   ├── RobloxAccount.tsx               # API key setup form
│   └── ConversionHistory.tsx           # Paginated history table
├── lib/
│   ├── auth.ts                         # NextAuth config + Discord guild check
│   ├── audio.ts                        # ffmpeg + yt-dlp processing
│   ├── crypto.ts                       # AES-256-GCM encryption
│   ├── prisma.ts                       # Prisma singleton
│   ├── ratelimit.ts                    # Per-plan rate limiting
│   └── roblox.ts                       # Roblox Open Cloud API
├── prisma/
│   └── schema.prisma                   # Database schema
├── types/
│   └── next-auth.d.ts                  # Session type extensions
└── middleware.ts                       # Route protection
```

---

## ⚙️ Server Requirements

For production (not Vercel serverless), ensure these are installed:
- **ffmpeg** — audio processing
- **yt-dlp** — YouTube/SoundCloud download

On Vercel Serverless, you need to use a layer or run a separate worker server for these. Alternatively, use a VPS (Railway, Render, DigitalOcean) for the processing parts.

### Vercel + Processing Workaround
You can use `@ffmpeg/ffmpeg` (WebAssembly) to avoid needing system ffmpeg, or offload processing to a separate microservice.

---

## 📦 Tech Stack

- **Next.js 14** — App Router, API Routes
- **NextAuth.js v4** — Discord OAuth
- **Prisma + PostgreSQL** — Database ORM
- **Tailwind CSS** — Styling utilities
- **Lucide React** — Icons
- **Zod** — Input validation
- **AES-256-GCM** — API key encryption (Node.js crypto)
- **ffmpeg / yt-dlp** — Audio processing
- **Roblox Open Cloud API** — Asset upload

---

## 💳 Pricing Plans (configure in DB)

| Plan | Conversions | File Size |
|---|---|---|
| FREE | 2/hour | 15MB |
| WEEKLY | Unlimited | 200MB |
| MONTHLY | Unlimited | 200MB |

