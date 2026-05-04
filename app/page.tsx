import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Clapperboard, Film, Sparkles, Zap } from "lucide-react";
import { PublicShelf } from "@/components/PublicShelf";
import { RecommendationList } from "@/components/RecommendationList";
import { HomeTourButton } from "@/components/HomeTourButton";

export default function HomePage() {
  return (
    <div className="cinema-shell min-h-screen overflow-hidden text-stone-100">
      <div className="grain-overlay pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 border-b border-amber-200/10 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-32 h-px w-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full border border-teal-200/10" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rotate-12 rounded-[3rem] border border-amber-300/10" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="pressable flex h-10 w-10 items-center justify-center rounded-md border border-amber-300/30 bg-amber-200/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] group-hover:border-amber-200/60 group-hover:bg-amber-200/16">
            <Clapperboard className="h-5 w-5 text-amber-200" />
          </div>
          <span className="font-display text-xl font-black tracking-normal text-stone-50">
            HypeShelf
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                id="nav-sign-in"
                className="pressable rounded-md border border-stone-200/14 bg-stone-950/30 px-4 py-2 text-sm font-semibold text-stone-200 hover:border-amber-200/40 hover:bg-amber-200/10 hover:text-amber-50"
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/shelf"
              id="nav-go-to-shelf"
              className="pressable flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-black text-stone-950 shadow-[0_14px_36px_rgba(217,151,61,0.25)] hover:bg-amber-200"
            >
              My Shelf <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SignedIn>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:pb-24 lg:pt-24">
        <div className="stagger-in max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 border-y border-amber-200/25 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-100/80">
            <Sparkles className="h-3.5 w-3.5 text-orange-300" />
            Shared recommendations for your crew
          </div>

          <h1 className="hero-heading font-display max-w-5xl text-[clamp(3.4rem,11vw,9.2rem)] font-black leading-[0.82] tracking-normal text-stone-50">
            Collect what your crew can&apos;t stop talking about.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
            HypeShelf turns movie and show recommendations into a living shelf:
            post the link, write the pitch, filter by mood, and catch the picks
            your friends keep pushing.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <SignedOut>
              <SignInButton mode="redirect">
                <button
                  id="hero-sign-in"
                  className="pressable flex items-center gap-2 rounded-md bg-amber-300 px-7 py-3.5 text-base font-black text-stone-950 shadow-[0_18px_52px_rgba(217,151,61,0.28)] hover:bg-amber-200"
                >
                  <Zap className="h-4 w-4" />
                  Get started - it&apos;s free
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/shelf"
                id="hero-go-to-shelf"
                className="pressable flex items-center gap-2 rounded-md bg-amber-300 px-7 py-3.5 text-base font-black text-stone-950 shadow-[0_18px_52px_rgba(217,151,61,0.28)] hover:bg-amber-200"
              >
                Go to my shelf <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
            <HomeTourButton />
          </div>
        </div>

        <div className="stagger-in relative min-h-[360px] border border-stone-200/12 bg-stone-950/28 p-4 shadow-[0_40px_100px_rgba(0,0,0,0.34)] [animation-delay:90ms]">
          <div className="absolute -left-5 top-8 hidden h-28 w-10 border-y border-l border-amber-200/20 lg:block" />
          <div className="grid h-full gap-3">
            {[
              ["Tonight", "The friend-group watchlist"],
              ["Staff Pick", "Pinned by the person with taste"],
              ["Genre", "Jump from horror to sci-fi without digging"],
            ].map(([label, text]) => (
              <div
                key={label}
                className="grid grid-cols-[5.5rem_1fr] items-center border border-stone-200/10 bg-stone-900/48"
              >
                <div className="flex h-full items-center justify-center border-r border-stone-200/10 bg-amber-200/8">
                  <Film className="h-5 w-5 text-amber-200" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">
                    {label}
                  </div>
                  <div className="font-display mt-2 text-2xl font-black leading-none text-stone-50">
                    {text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="latest-shelf-section relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="mb-7 flex flex-col gap-4 border-t border-stone-200/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200/70">
              Live Shelf
            </p>
            <h2 className="font-display mt-2 text-4xl font-black text-stone-50">
              Latest from the shelf
            </h2>
          </div>
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                id="latest-sign-in"
                className="pressable text-sm font-black text-amber-200 hover:text-amber-100"
              >
                Sign in to add yours
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/shelf"
              className="pressable text-sm font-black text-amber-200 hover:text-amber-100"
            >
              View all
            </Link>
          </SignedIn>
        </div>

        <Suspense fallback={<RecommendationList recs={undefined} readOnly />}>
          <PublicShelf />
        </Suspense>
      </section>

      <footer className="relative z-10 border-t border-stone-200/10 px-6 py-8 text-center text-sm text-stone-500">
        <p>
          Built with Next.js, Clerk &amp; Convex /{" "}
          <span className="text-amber-200">HypeShelf</span>
        </p>
      </footer>
    </div>
  );
}
