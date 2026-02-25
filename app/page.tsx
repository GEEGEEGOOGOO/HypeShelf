import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { Clapperboard, Sparkles, ArrowRight, Zap } from "lucide-react";
import { PublicShelf } from "@/components/PublicShelf";
import { RecommendationList } from "@/components/RecommendationList";
import { HomeTourButton } from "@/components/HomeTourButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute right-0 top-1/2 h-[300px] w-[300px] rounded-full bg-purple-600/8 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between border-b border-white/6 px-6 py-4 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 transition-all group-hover:bg-violet-600/30">
            <Clapperboard className="h-4 w-4 text-violet-400" />
          </div>
          <span className="font-bold text-zinc-100 tracking-tight">HypeShelf</span>
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                id="nav-sign-in"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-zinc-100"
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/shelf"
              id="nav-go-to-shelf"
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              My Shelf <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Shared recommendations for your crew
        </div>

        <h1 className="hero-heading mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Collect and share{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            the stuff
          </span>{" "}
          you&apos;re hyped about.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
          HypeShelf is your crew&apos;s shared movie shelf. Log in, post what
          you&apos;re watching, and discover what your friends are hyped about —
          in real time.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                id="hero-sign-in"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
              >
                <Zap className="h-4 w-4" />
                Get started — it&apos;s free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/shelf"
              id="hero-go-to-shelf"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all hover:bg-violet-500"
            >
              Go to my shelf <ArrowRight className="h-4 w-4" />
            </Link>
          </SignedIn>
          <HomeTourButton />
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
          {["Real-time updates", "Genre filters", "Staff picks", "Friend shelf"].map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-violet-500" />
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Latest recs strip */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-200">
            Latest from the shelf
          </h2>
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                id="latest-sign-in"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Sign in to add yours →
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/shelf"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </Link>
          </SignedIn>
        </div>

        <Suspense
          fallback={
            <RecommendationList recs={undefined} readOnly />
          }
        >
          <PublicShelf />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6 px-6 py-8 text-center text-sm text-zinc-600">
        <p>
          Built with ❤️ using Next.js, Clerk &amp; Convex ·{" "}
          <span className="text-violet-500">HypeShelf</span>
        </p>
      </footer>
    </div>
  );
}
