# Neura Tech AI — Production Website

A production-grade Next.js 15 (App Router) + TypeScript + Tailwind CSS +
Framer Motion website for an AI company. Includes:

- A backend that routes every model request through a **LiteLLM gateway**
- **Real auth** — Google, GitHub, and email/password (NextAuth v5 / Auth.js)
- **Real database** — PostgreSQL via Prisma
- **Real billing** — Stripe, 5 subscription tiers, checkout, portal, webhooks
- **Admin CMS** — manage blog posts, research papers, changelog, roadmap,
  datasets, benchmarks, and the status page — all from `/admin`
- **Hugging Face model sync**, **live benchmarks**, **datasets**, **API
  status**, **changelog**, **roadmap**, and a **community** page
- **Analytics panel** and **per-user usage graphs**

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Lucide icons ·
Recharts · NextAuth v5 (Auth.js) + Prisma adapter · Prisma + PostgreSQL ·
Stripe · LiteLLM

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the sections below
npx prisma db push           # create tables
npm run db:seed              # optional: demo benchmarks/datasets/changelog/roadmap/status
npm run dev
```

Open http://localhost:3000.

## 1. Database

Any Postgres works (Neon, Supabase, Railway, local).
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```
```bash
npx prisma db push        # dev: sync schema directly
npx prisma migrate dev --name init   # or: real migration history
npx prisma studio         # browse your data
```

## 2. Auth — Google, GitHub, email/password

```bash
npx auth secret   # generates AUTH_SECRET
```

**Google:** [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
→ OAuth client ID → Web application → redirect URI
`http://localhost:3000/api/auth/callback/google` → copy into
`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

**GitHub:** [github.com/settings/developers](https://github.com/settings/developers)
→ New OAuth App → callback URL
`http://localhost:3000/api/auth/callback/github` → copy into
`GITHUB_ID` / `GITHUB_SECRET`.

**Email/password** works with no extra config — bcrypt-hashed, never stored
in plain text.

## 3. Making yourself (or anyone) an admin

Add your email to `ADMIN_EMAILS` in `.env.local`:
```
ADMIN_EMAILS=you@gmail.com,cofounder@gmail.com
```
The next time that email signs in — Google, GitHub, or email/password, it
doesn't matter — `auth.ts` automatically sets their role to `ADMIN` in the
database. No manual DB edit needed.

Once you have one admin, that person can promote or demote **any other
user** from `/admin/users` — you don't have to keep editing `.env.local`
after the first admin exists.

Admins get access to `/admin` — protected by `middleware.ts`, checked again
inside every `/api/admin/*` route via `lib/require-admin.ts` (defense in
depth, not just a UI gate).

### What's in `/admin`

| Page | What it does |
|---|---|
| `/admin` | Overview stats + Hugging Face sync trigger |
| `/admin/analytics` | Total users, requests, estimated MRR, signup chart |
| `/admin/users` | View every user, grant/revoke admin access |
| `/admin/blog` | Create/edit/publish/delete blog posts (shown on `/blog`) |
| `/admin/research` | Create/edit/publish/delete research entries (shown on `/research`) |
| `/admin/content` | Changelog, roadmap, datasets, benchmarks, status components |

Blog and research pages read published entries straight from the database;
until you publish something, they show clearly-labeled demo content so the
pages don't look empty out of the box.

## 4. Billing (Stripe) — 5 subscription tiers

Free / Starter / Pro / Business / Enterprise (`lib/stripe.ts`, schema enum
`PlanTier`). Enterprise is "contact sales" only, no self-serve checkout.

1. Create a [Stripe](https://dashboard.stripe.com) account (test mode to start).
2. Create 3 Products with recurring monthly Prices: Starter, Pro, Business.
   Copy each Price ID into `STRIPE_PRICE_ID_STARTER` / `_PRO` / `_BUSINESS`.
3. Copy your secret key into `STRIPE_SECRET_KEY`.
4. Local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
5. In production, add a webhook endpoint at
   `https://yourdomain.com/api/webhooks/stripe` listening for
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.

`/pricing` creates a real Checkout Session per tier; the dashboard's "Manage
billing" opens a real Stripe Customer Portal session; the webhook keeps
`Subscription.tier` in sync automatically.

## 5. Hugging Face model sync

`lib/huggingface.ts` calls the public HF API for model stats (downloads,
likes). `app/api/huggingface/sync/route.ts`:
- `GET` — reads the last-synced snapshot from the database (fast).
- `POST` — triggers a fresh sync. Callable by an admin from `/admin`, or by
  a cron job using `CRON_SECRET` (see below) instead of a session.

Edit the `TRACKED_REPOS` list in that file to match the model repos you
actually publish on Hugging Face.

**Scheduling it** (e.g. Vercel Cron, `vercel.json`):
```json
{ "crons": [{ "path": "/api/huggingface/sync", "schedule": "0 * * * *" }] }
```
Have the cron call `POST` with header `x-cron-secret: $CRON_SECRET`
(set the same value in `CRON_SECRET`).

## 6. API status page

`/status` polls `/api/status` every 30s, which live-pings your
`LITELLM_BASE_URL` and combines it with the `StatusComponent` rows you
manage from `/admin/content` (seeded with demo components by `db:seed`).

## 7. LiteLLM (AI gateway)

```bash
pip install litellm[proxy]
```
```yaml
# litellm_config.yaml
model_list:
  - model_name: neuron-4b
    litellm_params:
      model: ollama/neuron-4b
  - model_name: neuron-14b
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
```
```bash
litellm --config litellm_config.yaml --port 4000
```
`LITELLM_BASE_URL=http://localhost:4000`

## Folder structure

```
auth.ts, middleware.ts          NextAuth v5 config + route protection
lib/admin-config.ts             ADMIN_EMAILS allowlist logic
lib/require-admin.ts            Server-side admin check for API routes
prisma/schema.prisma             Full schema (auth, billing, CMS, analytics)
prisma/seed.mjs                  Demo content for new database-backed pages

app/
├── page.tsx, models/, playground/, docs/, team/, contact/
├── blog/, research/                    Read PUBLISHED rows from the DB
├── benchmarks/, datasets/, changelog/, roadmap/, status/, community/
├── pricing/, login/, register/, dashboard/
├── admin/                              Layout + sidebar + all CMS pages
└── api/
    ├── auth/, chat|vision|image|embeddings|audio/, keys/
    ├── billing/checkout|portal/, webhooks/stripe/
    ├── huggingface/sync/, status/, usage/timeseries/
    └── admin/{blog,research,users,changelog,roadmap,datasets,benchmarks,status-components,analytics}/

components/
├── navbar.tsx, footer.tsx (Resources column links all the new pages)
├── auth/, dashboard/ (api-keys-panel, billing-panel, usage-graph)
├── admin/ (admin-sidebar, hf-sync-button)
└── blog-list.tsx, ui/

lib/ litellm.ts · prisma.ts · stripe.ts · api-auth.ts · rate-limit.ts ·
     admin-config.ts · require-admin.ts · huggingface.ts · utils.ts
```

## Deploying to Vercel

1. Push to GitHub, import at [vercel.com/new](https://vercel.com/new).
2. Add every variable from `.env.example` (production DB URL, production
   OAuth redirect URIs, live Stripe keys, a public LiteLLM URL — not
   `localhost`).
3. Update Google/GitHub OAuth redirect URIs to your production domain.
4. Add the Stripe webhook endpoint for your production domain.
5. Add a Vercel Cron entry for `/api/huggingface/sync` if you want scheduled syncing.
6. Deploy.

**Rate limiter note:** `lib/rate-limit.ts` is in-memory — fine for one
server, not shared across Vercel's serverless instances. Swap for
`@upstash/ratelimit` + Upstash Redis for real production traffic.

## What's implemented vs. placeholder

**Fully implemented:** every page and feature listed above, including real
auth, real billing (5 tiers), real database, admin CMS with role-based
access, Hugging Face sync, live status polling, and per-user usage graphs.

**Left as placeholders:**
- Playground's image upload / voice input buttons (UI-only)
- Contact form doesn't send anywhere yet — wire it to Resend/SendGrid
- No email verification or password-reset flow
- Blog/research content editor is plain textarea, not a rich WYSIWYG/markdown editor
- Enterprise plan is "contact sales" only (by design)

## Next steps I can help with

- Password reset / email verification
- Rich markdown/WYSIWYG editor for the CMS
- Usage-based rate limiting enforced per plan tier (not a flat IP limit)
- Swap the in-memory rate limiter for Upstash Redis
- Wire the contact form to a real email service
