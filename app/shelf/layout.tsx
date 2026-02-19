import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clapperboard } from "lucide-react";

export default async function ShelfLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
            {/* Ambient glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/6 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 transition-all group-hover:bg-violet-600/30">
                            <Clapperboard className="h-4 w-4 text-violet-400" />
                        </div>
                        <span className="font-bold text-zinc-100 tracking-tight">HypeShelf</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-zinc-500 sm:block">
                            Your shelf
                        </span>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8",
                                },
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10">{children}</main>
        </div>
    );
}
