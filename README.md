# Recieptify 🧾

A modern web application for generating, customizing, and managing professional invoices and receipts.

**Stack:** Next.js 15 (App Router) · Supabase · Tailwind CSS · jsPDF · TypeScript

---

## Features

- **Auth** — Email/password, Google OAuth, GitHub OAuth, password reset
- **Invoice & Receipt Generator** — Live preview, 3 templates (Modern, Minimal, Classic), logo upload, PDF export
- **Dashboard** — View, search, download, delete, share documents
- **Analytics** — Monthly revenue chart, payment status breakdown
- **Shareable Links** — Public URLs for any document (no login needed for recipients)
- **Dark / Light Mode** — System-aware with manual toggle
- **Custom Branding** — Choose brand accent color in settings

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd recieptify
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the **SQL Editor**, run the contents of `supabase/schema.sql` to create all tables, policies, and storage buckets
3. In **Authentication → Providers**, enable:
   - Email (enabled by default)
   - Google OAuth (add Client ID & Secret from [Google Cloud Console](https://console.cloud.google.com))
   - GitHub OAuth (add Client ID & Secret from [GitHub Developer Settings](https://github.com/settings/developers))

> For Google & GitHub OAuth, set the callback URL to:
> `https://<your-supabase-project>.supabase.co/auth/v1/callback`

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find your Supabase URL and anon key in **Project Settings → API**.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
recieptify/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (fonts, ThemeProvider)
│   ├── not-found.tsx             # 404 page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── callback/route.ts     # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── page.tsx              # Overview + stats
│   │   ├── invoices/page.tsx
│   │   ├── receipts/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── invoice/new/page.tsx
│   ├── receipt/new/page.tsx
│   └── share/[token]/page.tsx    # Public shareable document view
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Nav sidebar with dark mode toggle
│   │   ├── Topbar.tsx            # Page header with user info
│   │   └── ThemeProvider.tsx     # next-themes wrapper
│   ├── dashboard/
│   │   └── DocumentList.tsx      # Searchable document list with actions
│   └── documents/
│       ├── DocumentForm.tsx      # Full invoice/receipt creation form
│       └── DocumentPreview.tsx   # Live document preview + PDF download
│
├── hooks/
│   └── useDocuments.ts           # Supabase CRUD + share link logic
│
├── lib/
│   ├── utils.ts                  # cn, formatCurrency, calculateTotals, etc.
│   ├── pdf.ts                    # jsPDF document generation (3 templates)
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       ├── server.ts             # Server Supabase client
│       ├── middleware.ts         # Auth route protection
│       └── types.ts              # Full TypeScript types
│
├── styles/
│   └── globals.css               # Tailwind + CSS variables (light/dark)
│
├── supabase/
│   └── schema.sql                # DB tables, RLS policies, storage setup
│
├── middleware.ts                 # Next.js middleware (route protection)
└── .env.local.example
```

---

## Database Schema

### `documents`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key → auth.users |
| `type` | text | `invoice` or `receipt` |
| `data` | jsonb | Full document data (items, totals, etc.) |
| `logo_url` | text | Supabase Storage URL |
| `share_token` | text | Unique token for public share link |
| `template` | text | `minimal`, `modern`, or `classic` |
| `created_at` | timestamptz | Auto-set |

### `profiles`
| Column | Type | Description |
|---|---|---|
| `id` | uuid | Foreign key → auth.users |
| `full_name` | text | Display name |
| `business_name` | text | Used in document defaults |
| `theme_color` | text | Brand accent hex color |

**Row Level Security** is enabled on all tables — users can only access their own data.

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "init: recieptify"
git remote add origin https://github.com/your-username/recieptify.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
2. Add environment variables in **Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_APP_URL   ← set to your Vercel production URL
   ```
3. Click **Deploy**

### 3. Update OAuth Redirect URLs

After deploying, add your Vercel URL to:
- Supabase → **Authentication → URL Configuration → Site URL**: `https://your-app.vercel.app`
- Supabase → **Authentication → URL Configuration → Redirect URLs**: `https://your-app.vercel.app/auth/callback`
- Google Cloud Console → Authorized redirect URIs
- GitHub OAuth App → Authorization callback URL

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL for shareable links |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | React framework (App Router) |
| [Supabase](https://supabase.com) | Auth, PostgreSQL, Storage |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF generation |
| [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | PDF table rendering |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode |
| [lucide-react](https://lucide.dev) | Icons |
| [uuid](https://github.com/uuidjs/uuid) | Unique ID generation |

---

## License

MIT
