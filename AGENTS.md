<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Build a complete website for an online tutoring startup. The company matches students with tutors and then connects them. Use your own judgment on structure, UI design, and implementation details.

## Product
- Students sign up and submit a tutoring request (subject, level, goals, language, budget, availability).
- Tutors apply through an open careers page (no account needed): subjects, levels, languages, hourly rate, experience, availability, CV upload.
- Admins review applications, see each request alongside suggested tutors, create a match, and send an intro email to both sides.
- Public pages: a landing page with a "Book a free demo" call to action, a demo booking page (Cal.com embed), and a contact page with all company handles plus a short contact form.
- Add Google sign-in alongside email and password.

## Stack
- Next.js 16 (App Router, TypeScript, `src/` directory, `@/*` import alias), Tailwind CSS, shadcn/ui
- Supabase (Auth, Postgres, Storage) using `@supabase/ssr`
- Resend for emails, Cal.com embed for demo booking, deploy on Vercel

## Rules for Next.js 16 and Supabase
- The file formerly called middleware is `src/proxy.ts`, exporting a function named `proxy`. Do not create a `middleware.ts`.
- `cookies()` from `next/headers` is async and must be awaited.
- Use `supabase.auth.getClaims()` on the server. Never use `getSession()` in server code.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never expose the service-role key to the browser; use it only in server-only code.
- Use `Link` from `next/link` and `useRouter` from `next/navigation`.
- Server components by default; `"use client"` only for interactive parts.

## Database (already created in Supabase, don't recreate)
- `profiles` (id, role: student|tutor|admin, full_name, email), auto-created by a trigger that reads `full_name` from signup metadata
- `student_requests` (id, student_id, subject, level, goals, language, budget_max, availability jsonb, status: new|matching|matched|closed)
- `tutor_applications` (id, full_name, email, subjects text[], levels text[], languages text[], hourly_rate, experience, availability jsonb, cv_url, status: new|reviewed|approved|rejected)
- `matches` (id, request_id, tutor_application_id, score, status: proposed|introduced|active|ended, notes)
- `contact_messages` (id, name, email, message)
- Row-level security is on: students see only their own requests, anyone can insert a tutor application or contact message, admins read everything, `matches` is admin-only.
- Availability is stored as slot strings like "mon-evening" and "sat-morning".
- Matching logic: subject match is required; level, availability overlap, language, and budget add points. Return the top suggestions with plain-language reasons.

## Already in the project (reuse, don't rewrite or duplicate)
- `src/lib/supabase/client.ts`, `server.ts`, and `proxy.ts` (`updateSession`)
- `src/proxy.ts`
- `/signup` and `/login` pages (email + password) in the `(auth)` route group
- Before creating any new file, check whether an equivalent already exists and reuse it.

## Security rules
- Enforce admin-only access on the server (check the user's role in `profiles`), not just by hiding links in the UI.
- Never trust `student_id` or role values sent from the browser; derive them from the authenticated user.
- Validate and limit file uploads (type and size) for CVs, and keep the `cvs` bucket private.
- Do not weaken or bypass row-level security to make something work. If a policy blocks a feature, tell me and propose a policy change instead.
- Never hard-code secrets or commit `.env.local`.

## Git and deployment rules
- Do NOT push anything. No `git push`, no force pushes, no creating or pushing branches or tags to a remote.
- Do NOT deploy, and do NOT run anything against a production environment.
- Do not make destructive changes (deleting files or data, resetting the database) without asking me first.
- Leave all changes local so I can review them before deciding what to commit.

## Deliverable
Finish everything above that isn't already built. At the end, give me:
1. A list of env vars, Supabase dashboard settings (e.g. the private `cvs` storage bucket, the Google provider), and any other manual steps I need to do myself.
2. A short list of assumptions you made and any security-sensitive spots I should review (admin checks, uploads, RLS).