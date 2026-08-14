# Deploy WasteTrack Ghana (Neon + Vercel)

The app uses **Neon Postgres** and **Vercel**. SQLite is no longer used.

## 1. Create a Neon database

1. Open [https://console.neon.tech](https://console.neon.tech) and sign in (GitHub is fine).
2. **New Project**
   - Name: `wastetrack-ghana`
   - Region: closest to you (or `eu-central-1`)
   - Postgres version: default
3. After it is created, open **Dashboard → Connection details**.
4. Copy **two** URLs:

| Vercel / `.env` name | Which Neon URL | How to recognise it |
|---|---|---|
| `DATABASE_URL` | **Pooled** connection | Host contains `-pooler` |
| `DIRECT_URL` | **Direct** connection | Host does **not** contain `-pooler` |

On the pooled URL, add `&pgbouncer=true` if it is not already there. Both URLs should include `sslmode=require`.

Example shape (do not commit real passwords):

```
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://neondb_owner:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
```

## 2. Local `.env`

In the project root, `.env` must look like:

```
DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://.../neondb?sslmode=require"
JWT_SECRET="a-long-random-string-at-least-32-characters"
```

Then:

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. Vercel environment variables

In [Vercel](https://vercel.com) → your project → **Settings → Environment Variables**, add these for **Production**, **Preview**, and **Development**:

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** URL |
| `DIRECT_URL` | Neon **direct** URL |
| `JWT_SECRET` | Same long random secret as local (not the sample `change-me` value) |

Generate a secret:

```bash
openssl rand -base64 48
```

Do **not** tick “Sensitive” in a way that blocks builds from reading them — they must be available at **build time** because `prisma migrate deploy` runs during `npm run build`.

## 4. Deploy on Vercel

### Option A — Git (recommended)

Repo: `https://github.com/DarkeyPeleg/WasteTrack.git`

1. Push this branch to GitHub.
2. [vercel.com/new](https://vercel.com/new) → Import **WasteTrack**.
3. Framework: **Next.js** (auto-detected).
4. Add the three env vars from step 3 **before** the first deploy.
5. Deploy.

After the first successful deploy, seed production once from your machine (uses production `DATABASE_URL`):

```bash
npx prisma db seed
```

(If seed uses local `.env`, that is your Neon DB — seeding once is enough for both local and Vercel.)

### Option B — CLI

```bash
npm i -g vercel
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL
npx vercel env add DIRECT_URL
npx vercel env add JWT_SECRET
npx vercel --prod
```

Paste the Neon URLs and JWT secret when asked. Apply them to Production (and Preview).

## 5. Examiner test accounts (after seed)

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@wastetrack.gh` | `Password123!` |
| Resident | `resident@wastetrack.gh` | `Password123!` |

## 6. If the build fails

| Error | Fix |
|---|---|
| `Can't reach database server` | Wrong host, or Neon project suspended — wake it in Neon console |
| `P1001` / SSL | Add `?sslmode=require` |
| `migrate deploy` fails on pooler | `DIRECT_URL` must be the **non-pooler** host |
| Empty site / login fails | Run `npx prisma db seed` against Neon |
| Old SQLite error `file:./dev.db` | Env vars not set on Vercel — add them and redeploy |

Build command (already in `package.json`):

```
prisma generate && prisma migrate deploy && next build
```
