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
        <div className="cinema-shell min-h-screen overflow-hidden text-stone-100">
            <div className="grain-overlay pointer-events-none fixed inset-0" />
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
                <div className="absolute -right-24 top-16 h-80 w-80 rounded-full border border-teal-200/10" />
            </div>

            <header className="relative z-10 border-b border-stone-200/10 bg-stone-950/18 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="pressable flex h-10 w-10 items-center justify-center rounded-md border border-amber-300/30 bg-amber-200/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] group-hover:border-amber-200/60 group-hover:bg-amber-200/16">
                            <Clapperboard className="h-5 w-5 text-amber-200" />
                        </div>
                        <span className="font-display text-xl font-black tracking-normal text-stone-50">HypeShelf</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs font-black uppercase tracking-[0.22em] text-amber-200/60 sm:block">
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
