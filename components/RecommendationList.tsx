"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Clapperboard } from "lucide-react";

interface RecommendationListProps {
    recs: Doc<"recommendations">[] | undefined;
    currentUserId?: string;
    isAdmin?: boolean;
    readOnly?: boolean;
    emptyMessage?: string;
}

function CardSkeleton() {
    return (
        <div className="flex min-h-64 flex-col gap-4 border border-stone-200/10 bg-stone-950/32 p-5">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="mt-auto flex items-center gap-2 border-t border-stone-200/10 pt-4">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
    );
}

export function RecommendationList({
    recs,
    currentUserId,
    isAdmin,
    readOnly = false,
    emptyMessage = "No recommendations yet - be the first!",
}: RecommendationListProps) {
    if (recs === undefined) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (recs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-stone-200/16 bg-stone-950/24 px-6 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-md border border-amber-300/24 bg-amber-300/10">
                    <Clapperboard className="h-8 w-8 text-amber-200" />
                </div>
                <div>
                    <p className="font-display text-2xl font-black text-stone-100">{emptyMessage}</p>
                    <p className="mt-2 text-sm text-stone-500">
                        Add your first recommendation above.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((rec, index) => (
                <div
                    key={rec._id}
                    className="stagger-in"
                    style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                >
                    <RecommendationCard
                        rec={rec}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                        readOnly={readOnly}
                    />
                </div>
            ))}
        </div>
    );
}
