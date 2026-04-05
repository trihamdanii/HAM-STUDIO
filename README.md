# HAM STUDIO - Roblox Audio Converter

Dashboard app for converting and uploading audio to Roblox.

## Deploy to Vercel (3 steps)

### Option A: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B: Deploy via GitHub
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo → Deploy

### Option C: One-click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** icons

## Structure

```
app/
  layout.tsx      # Root layout + fonts
  page.tsx        # Dashboard page
  globals.css     # Global styles + cyber theme
components/
  Header.tsx          # Navigation header
  StatsCards.tsx      # 4 stat cards
  ConvertAudio.tsx    # Audio conversion form
  RobloxAccount.tsx   # Roblox API key setup
  ConversionHistory.tsx # History table
```

## Adding Real Backend

Replace mock data in `app/page.tsx` with real API calls. The app is ready for:
- NextAuth.js for Discord OAuth
- Prisma for database
- Roblox Open Cloud API integration
