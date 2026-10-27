import Link from "next/link";
import { RouteGlobe } from "@/components/ui/route-globe";

const steps = [
  ["01", "Tell us what you need", "Share your goals, schedule, and the kind of support that would make learning click."],
  ["02", "Meet your best-fit tutor", "We shortlist experienced tutors whose subject expertise and style fit your request."],
  ["03", "Start making progress", "Connect, try a first session, and build a learning rhythm that lasts."],
];

export default function Home() {
  return (
    <main className="bg-[#f5f0e7] text-[#15233b]">
      <section className="overflow-hidden bg-[#15233b] text-[#fff8ec]">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">tutor<span className="text-[#ff7058]">acumen</span></Link>
            <div className="hidden items-center gap-8 text-sm text-[#b8c5d4] md:flex">
              <Link href="/how-it-works" className="hover:text-white">How it works</Link>
              <Link href="/careers" className="hover:text-white">Become a tutor</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/login" className="hidden px-3 py-2 sm:block">Log in</Link>
              <Link href="/signup" className="rounded-full bg-[#ff7058] px-5 py-2.5 font-semibold text-white">Get started</Link>
            </div>
          </nav>
          <div className="grid items-center gap-8 pt-20 lg:grid-cols-[.9fr_1.1fr] lg:pt-28">
            <div>
              <p className="mb-6 text-sm font-semibold uppercase tracking-[.2em] text-[#ffb7a7]">Learning, reimagined</p>
              <h1 className="max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.05em] sm:text-7xl">The right tutor changes everything.</h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[#b8c5d4]">Personalized support from brilliant tutors who meet you where you are — and help you get where you want to go.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/request" className="rounded-full bg-[#ff7058] px-7 py-3.5 font-semibold text-white">Find my tutor <span aria-hidden>→</span></Link>
                <Link href="/demo" className="rounded-full border border-[#61718a] px-7 py-3.5 font-semibold hover:border-[#ff7058]">Book a free demo</Link>
              </div>
            </div>
            <div className="relative"><div className="pointer-events-none absolute inset-10 rounded-full bg-[#a9d6c1]/20 blur-3xl" /><RouteGlobe /></div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#e45c48]">A better way to learn</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">No guesswork.<br />Just a tutor who gets it.</h2>
          </div>
          <p className="max-w-xs text-base leading-7 text-[#5e6a78]">Every learner is different. Your support should be too.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">{steps.map(([number, title, copy]) => <div key={number} className="group min-h-[285px] rounded-[1.75rem] border border-[#e4dbce] bg-[#fffaf2] p-7 transition hover:-translate-y-1 hover:border-[#ff7058]"><div className="flex items-start justify-between"><span className="text-sm font-bold text-[#e45c48]">{number}</span><span className="grid h-9 w-9 place-items-center rounded-full border border-[#e4dbce] text-lg transition group-hover:border-[#ff7058] group-hover:bg-[#ff7058] group-hover:text-white">↗</span></div><div className="mt-20"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 max-w-xs leading-7 text-[#5e6a78]">{copy}</p></div></div>)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#15233b] text-[#fff8ec] md:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#ffb7a7]">More than a matching service</p>
            <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Learning works better when it feels human.</h2>
            <p className="mt-6 max-w-lg leading-7 text-[#b8c5d4]">A thoughtful match is only the beginning. We help you find a rhythm, build confidence, and keep moving when the work gets difficult.</p>
            <Link href="/how-it-works" className="mt-9 inline-flex items-center gap-3 rounded-full border border-[#61718a] px-6 py-3 font-semibold transition hover:border-[#ff7058] hover:bg-[#ff7058]">See how it works <span aria-hidden>→</span></Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#31425c]">
            {[["1:1", "Support that is completely personal"], ["7 days", "A week to find your best fit"], ["100%", "Focused on your goals"], ["∞", "Room to keep growing"]].map(([stat, label]) => <div key={stat} className="flex min-h-[170px] flex-col justify-end bg-[#1d2c47] p-7"><span className="text-4xl font-bold text-[#a9d6c1]">{stat}</span><span className="mt-3 text-sm leading-5 text-[#b8c5d4]">{label}</span></div>)}
          </div>
        </div>
      </section>
      <section className="mx-6 mb-10 overflow-hidden rounded-[2rem] bg-[#a9d6c1] px-8 py-16 text-center lg:mx-auto lg:max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#42675a]">Your next chapter starts here</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Ready to learn differently?</h2>
        <p className="mx-auto mt-5 max-w-lg text-[#29483e]">Tell us what you’re working towards. We’ll take care of the matching.</p>
        <Link href="/request" className="mt-9 inline-block rounded-full bg-[#15233b] px-7 py-3.5 font-semibold text-white transition hover:bg-[#ff7058]">Start your request <span aria-hidden>→</span></Link>
      </section>
      <footer className="mx-auto max-w-7xl px-6 pb-10 lg:px-10">
        <div className="flex flex-col gap-8 border-t border-[#ded4c6] pt-8 text-sm text-[#5e6a78] sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/" className="text-lg font-bold tracking-tight text-[#15233b]">tutor<span className="text-[#e45c48]">acumen</span></Link><p className="mt-2">Thoughtful tutoring for ambitious learners.</p></div>
          <div className="flex gap-6"><Link href="/how-it-works" className="hover:text-[#e45c48]">How it works</Link><Link href="/careers" className="hover:text-[#e45c48]">Become a tutor</Link><Link href="/contact" className="hover:text-[#e45c48]">Contact</Link></div>
          <span>© {new Date().getFullYear()} Tutor Acumen</span>
        </div>
      </footer>
    </main>
  );
}
