# WasteTrack Ghana

Web app for household waste-collection requests and tracking in Ghanaian residential communities.

Residents register, submit collection requests, and track status online. Administrators view all requests, assign collectors, and progress jobs through **Pending → Assigned → In Progress → Collected** (or Cancelled).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (local / exam MVP database)
- JWT auth in httpOnly cookies (`jose`) + bcrypt password hashes
- Zod validation
- Deploy target: Vercel

## Local setup

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file, e.g. `file:./dev.db` |
| `JWT_SECRET` | Secret used to sign session tokens |

See `.env.example`.

## Test credentials (seeded)

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@wastetrack.gh` | `Password123!` |
| Resident | `resident@wastetrack.gh` | `Password123!` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client + production build |
| `npm run test:api` | API smoke tests (dev server must be running) |
| `npm run db:seed` | Re-seed admin/resident accounts |

## Requirements covered

- **Must:** FR-01–FR-09 (register/login, RBAC, submit/validate/track requests, admin assign & status)
- **Should:** FR-10–FR-12 (resident dashboard, admin filter, status stats)
- **Security NFRs:** hashed passwords, auth redirects, server-side admin checks

## Project docs

- [PLAN.md](./PLAN.md) — implementation plan
- [design.md](./design.md) — software design

## Acknowledgements (NFR-08)

Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite, Zod, bcryptjs, jose, Vercel.
