# Tutor Acumen

Tutor Acumen is a Next.js 16 tutoring marketplace that collects student learning requests, accepts tutor applications, and gives admins explainable tutor suggestions.

## Local development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` (never commit it) with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CALCOM_URL=https://cal.com/your-team/your-event
RESEND_API_KEY=
INTRO_FROM_EMAIL=
```

The Supabase URL and anon key are safe for browser use when Row Level Security is enabled. Do not add a service-role key to this project or expose one to the browser. The Cal.com URL is optional; without it, the demo page displays setup guidance. `RESEND_API_KEY` and `INTRO_FROM_EMAIL` are server-only and are required for sending match introductions.

## Supabase setup

The database schema and RLS policies described in `AGENTS.md` are prerequisites. Confirm that:

1. The `cvs` Storage bucket exists and is **private**.
2. Anonymous users can insert tutor applications and contact messages, but cannot read either table.
3. Authenticated students can insert requests only for their own user ID and read only their own requests.
4. Admin policies allow the `admin` role in `profiles` to read requests/applications and insert matches.
5. The profile trigger copies `full_name` from signup metadata.
6. Google is enabled under Authentication → Providers, with the Supabase callback URL configured in Google Cloud. Add the deployed `/auth/callback` URL to the provider’s redirect allow-list.

CV uploads are limited server-side to PDF/DOC/DOCX and 5MB. Storage policies should allow the application submitter to upload but keep CV objects private; use a signed URL flow when an admin needs to download a CV.

## Main routes

- `/` — landing page
- `/request` — authenticated student tutoring request
- `/careers` — public tutor application with CV upload
- `/demo` — Cal.com demo booking embed
- `/contact` — public contact form and company handles
- `/admin` — server-enforced admin dashboard with scored tutor suggestions
- `/login` and `/signup` — email/password and Google sign-in

## Assumptions and security review

- Tutor Acumen’s email handles are represented by `hello@tutoracumen.com`, `@tutoracumen`, and the Tutor Acumen LinkedIn name; replace these with the company’s verified handles before launch.
- Matching is intentionally transparent and lightweight: subject is required, while level, language, budget, and availability add points. It currently presents proposed matches; an email/Resend introduction workflow can be added once production email addresses and templates are confirmed.
- Admin authorization is checked on the server against `profiles.role`; hiding the `/admin` link is not used as authorization.
- The anon Supabase client is used for submissions, so final behavior depends on the existing RLS policies. Do not weaken RLS to resolve a policy error.
- Review the CV Storage policies carefully. The bucket must remain private and must not permit public object reads.
