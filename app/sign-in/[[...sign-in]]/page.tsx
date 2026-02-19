import { SignIn } from "@clerk/nextjs";
import { Clapperboard } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 mb-8 flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30">
                        <Clapperboard className="h-5 w-5 text-violet-400" />
                    </div>
                    <span className="text-xl font-bold text-zinc-100 tracking-tight">HypeShelf</span>
                </Link>
                <p className="text-sm text-zinc-500">Sign in to access your shelf</p>
            </div>

            <div className="relative z-10">
                <SignIn />
            </div>
        </div>
    );
}
