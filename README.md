# WasteTrack Ghana

Web app for household waste-collection requests and tracking in Ghanaian residential communities.

Residents register, submit collection requests, and track status online. Administrators view all requests, assign collectors, and progress jobs through **Pending → Assigned → In Progress → Collected** (or Cancelled).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + **Neon Postgres**
- JWT auth in httpOnly cookies (`jose`) + bcrypt password hashes
- Zod validation
- Hosting: **Vercel**

## Local setup

You need a Neon database first. See [DEPLOY.md](./DEPLOY.md).

```bash
npm install
# put DATABASE_URL, DIRECT_URL, JWT_SECRET in .env
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DIRECT_URL` | Neon **direct** connection string (migrations) |
| `JWT_SECRET` | Secret used to sign session tokens |

See `.env.example`.

## Test credentials (seeded)

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@wastetrack.gh` | `Password123!` |
| Resident | `resident@wastetrack.gh` | `Password123!` |

## Deploy

Full checklist: **[DEPLOY.md](./DEPLOY.md)** (Neon project, Vercel env vars, Git or CLI deploy).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Migrate, generate Prisma client, production build |
| `npm run test:api` | API smoke tests (dev server must be running) |
| `npm run db:seed` | Re-seed admin/resident accounts and collectors |

## Requirements covered

- **Must:** FR-01–FR-09 (register/login, RBAC, submit/validate/track requests, admin assign & status)
- **Should:** FR-10–FR-12 (resident dashboard, admin filter, status stats)
- **Security NFRs:** hashed passwords, auth redirects, server-side admin checks

## Project docs

- [PLAN.md](./PLAN.md) — implementation plan
- [design.md](./design.md) — software design
- [DEPLOY.md](./DEPLOY.md) — Neon + Vercel deploy

## Acknowledgements (NFR-08)

Next.js, React, TypeScript, Tailwind CSS, Prisma, Neon Postgres, Zod, bcryptjs, jose, Vercel.
