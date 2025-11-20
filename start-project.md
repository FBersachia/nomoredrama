# Vibecode Project Blueprint — Nomoredrama

> Copy this file at the start of each session and include the key files (see section 1).  
> No ALL_CAPS placeholders remain; update if the project changes.

---

## Quick Reference Summary

**Tech Stack:**  
- Backend: Node.js 20 + TypeScript + Express + Sequelize (PostgreSQL/Supabase) + JWT Auth  
- Frontend: React 18 + TypeScript + Vite + React Router v6  
- Validation: Zod  
- Deployment: Vercel (frontend + serverless API) + Supabase (DB/storage)

**Key Commands (update if scripts change):**
```bash
# Local backend
cd backend && npm install && npm run dev
cd backend && npm run lint
cd backend && npm test            # if tests exist
cd backend && npm run db:migrate  # sequelize-cli or equivalent
cd backend && npm run db:seed     # if applicable

# Local frontend
cd frontend && npm install && npm run dev
cd frontend && npm run build
cd frontend && npm run lint
cd frontend && npm test           # if tests exist
```

**Critical Don'ts:**
- Don't add big new frameworks/libs without approval.  
- Don't commit secrets or `.env`.  
- Don't do wide refactors without asking.  
- Don't skip tests when behavior changes.  
- Don't break routing/typing/error conventions.

**AI Response Protocol (each task):**
1. Restate the goal in 1–3 sentences.  
2. Short plan (3–5 bullets).  
3. Apply changes incrementally (files/commands).  
4. Propose/update tests and how to run them.  
5. Risks, trade-offs, next steps.

---

## 1. Project Context Snapshot (this session)

- Project: Nomoredrama — interactive web portfolio/EPK.  
- Current focus: interactive web version with protected admin to edit content; Spanish only; main CTA WhatsApp.  
- Repo state: scaffolds created (`backend/` Express+Sequelize, `frontend/` Vite+React). Models and full UI pending.  
- Key docs this session:
  - `recursos/original-prompt.md` (aesthetic vision, sections, tone)  
  - `content_sources.md` (content checklist to fill)  
- Key files (initial): frontend `src/`, backend `src/`.  
- Constraints/priorities:
  - Keep Y2K/cyberpunk vibe: black, dark violet, metallic, greens.  
  - Images local in `Recursos/Fotos/`; videos via embeds (YouTube/Vimeo).  
  - Spanish copy only.  
  - Admin with auth (edit protection).  
  - Main CTA via WhatsApp.  
  - Replace demo auth and complete models/migrations before real content.

---

## 2. Role & Collaboration Contract (AI Instructions)

You act as senior full-stack engineer + architect.  
- Stick to declared architecture; big changes only with approval.  
- Surgical, reversible changes.  
- Keep naming/structure/types consistent.  
- Explain decisions with concrete trade-offs.  
- Propose/update tests; keep docs aligned.  
- If ambiguous, ask short clarifying questions before risky changes.

---

## 3. Project Identity & Goals

**Name:** Nomoredrama  
**Domain:** Portfolio/EPK for DJ/producer.  
**Primary users:** Luca (artist/client), Francisco (developer/admin).  
**MVP goal (web):**  
Spanish-only portfolio showing bio, Y2K/cyberpunk visuals, live sets (embeds), collaborations, influences, and WhatsApp booking CTA; admin page protected to edit content (text, local images, video/social URLs).

**Non-functional priorities (order):**
1) Performance: light initial load (<2s on 4G when feasible; lazy-load media).  
2) Security: admin auth, no sensitive data in client, no leaked secrets.  
3) Accessibility: good contrast, keyboard nav, basic ARIA/alt text.  
4) UX: smooth transitions aligned with aesthetic without overload.  

**Out of scope (now):**
- External integrations (advanced analytics, third parties).  
- Native mobile app.  
- Stack refactors/schema changes unless needed.  
- Multilanguage (Spanish only this release).

---

## 4. Tech Stack & Architecture Baseline

### Backend
- Runtime: Node.js 20  
- Language: TypeScript  
- Framework: Express (REST)  
- ORM: Sequelize (PostgreSQL/Supabase)  
- Auth: JWT (admin)  
- Validation: Zod  
- Media: video embeds; images served statically from repo (no uploads in MVP).

**API Versioning**
- URL `/api/v1/...`  
- Supported: `["v1"]`  
- Breaking changes → new version with deprecation notice; inside v1 only additive changes.

### Frontend
- React 18 + TypeScript  
- Build: Vite  
- UI: custom Y2K/cyberpunk; light motion (e.g., framer-motion optional)  
- Routing: React Router v6  
- Forms: React Hook Form + Zod  
- HTTP: Axios  
- State: React Query for remote data; simple local state via hooks/context.

### Database
- Supabase Postgres.  
- Migrations: Sequelize.  
- Seeds: optional for demo content.

### DevOps & Tooling
- Docker optional (not required on Vercel).  
- Testing: Vitest/Jest (to be set up).  
- Lint/Format: ESLint + Prettier.

**Architecture principles**
- Clear separation frontend/backend/DB.  
- Backend by domain modules (controllers/services/routes).  
- Frontend by features/pages + reusable components.  
- No direct DB access from frontend; API only.  
- Favor composition over inheritance.

---

## 5. Repository Layout & Conventions

Expected:
```
root/
  backend/
    src/modules/
    src/middlewares/
    src/utils/
    src/prisma|sequelize/   # config/migrations
  frontend/
    src/pages/
    src/components/
    src/hooks/
    src/services/
  recursos/                 # prompts, assets
  docs/ or context/         # AI instructions, specs
```

Rules:
- Descriptive names; camelCase (vars/fns), PascalCase (components/classes), SNAKE_CASE (const/env).  
- Keep files cohesive; avoid moving/renaming without need.

---

## 6. Documentation Set (maintain)

- `README.md` — overview/quickstart.  
- `PRD.md` — portfolio goals/sections.  
- `especificacion_funcional.md` — actors, flows (admin, visitor).  
- `especificacion_tecnica.md` — architecture, models, endpoints.  
- `TESTING.md` — strategy and commands.  
- `SETUP.md` — local + Vercel + Supabase.  
- `DEPLOYMENT.md` — prod steps.  
- `TODO.md` / `tasklist-*.md` — backlog.  
- `errors.md` — common issues.  
- `context/` — AI instructions, session log.  
- `content_sources.md` — content checklist (already created).

---

## 7. Workflow (Scrum/Kanban hybrid)

- Board: Backlog → Ready → In Progress → In Review → In Testing → Blocked → Done.  
- DoR: clear description, specs references, acceptance criteria, dependencies.  
- DoD: code implemented, tests added/updated, docs aligned, breaking changes noted, known issues logged.

When working a card:
1) Restate goal.  
2) Acceptance.  
3) Concrete plan.  
4) Execute with AI protocol.  
5) Final report (tests, risks, pending).

---

## 8. AI Context Management

- Keep sessions focused.  
- Use short context files (context/, docs/) for architecture decisions, patterns, common mistakes.  
- `session_log.md`: feature, files touched, last actions, pending.  
- Review `CommonAIMistakes.md` if present and avoid repeats.

---

## 9. Implementation Rules & Quality Bar

- Respect API response/error patterns.  
- Validate inputs at edges (Zod in controllers/forms).  
- Tests for behavioral changes; specify commands.  
- Readability tweaks ok; large refactors only with approval.  
- No big deps without justification.

---

## 10. Setup & Environment Expectations

- Backend local:
  - `cd backend && npm install`
  - `cp .env.example .env` and set `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`, `LOG_LEVEL`
  - `npm run dev`
  - Migrations: `npm run db:migrate` (Sequelize). Seeds optional.

- Frontend local:
  - `cd frontend && npm install`
  - `cp .env.example .env` and set `VITE_API_URL`
  - `npm run dev`

- Vercel:
  - Frontend build `npm run build` (Vite).  
  - API serverless under `/api` using Express adapter.  
  - Env vars configured in Vercel and Supabase.

---

## 11. Testing & Verification Guidance

- Backend: Vitest/Jest + Supertest (to set up). Focus on admin auth, content CRUD, validations.  
- Frontend: React Testing Library for key pages/components (bio, galleries, admin forms).  
- E2E (optional): Playwright/Cypress for key flows (view portfolio, open video, WhatsApp CTA, admin login/edit).  
- Always note positive/negative cases and commands to run.

---

## 12. Deployment & Operations

- Hosting: Vercel (frontend + serverless backend).  
- DB: Supabase Postgres (run migrations outside build).  
- Vercel routes: `/api/(.*)` → serverless handler.  
- SPA routing: fallback to `index.html`.  
- Checklist: env vars, prod migrations, health checks, CORS, basic logs/monitoring.

---

## 13. Error Handling & Troubleshooting

- Document errors in `errors.md` with message, cause, fix, prevention.  
- Reproduce before fixing; isolate layer (frontend/backend/DB).  
- Turn incidents into regression tests.

---

## 14. Version Control & Git Workflow

- Strategy: short-lived branches (`feature/...`, `fix/...`, `chore/...`).  
- Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).  
- Small PRs with description, evidence (screens/logs), notes on migrations/breaking.  
- Prefer squash or rebase per repo policy.

---

## 15. How to use this blueprint in a new session

1) Paste this updated file.  
2) Attach only relevant docs/files (e.g., touched modules, spec sections, `session_log.md`).  
3) State the concrete task (e.g., “Implement live sets page with embeds and CTA”).  
4) AI should: restate task, make a short plan, apply incremental changes + propose tests, list risks/pending.  
5) Keep docs and tasklist in sync as work progresses.
