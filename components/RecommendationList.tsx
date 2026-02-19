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
        <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/4 p-5">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-6 w-6 rounded-full" />
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
    emptyMessage = "No recommendations yet — be the first!",
}: RecommendationListProps) {
    // Loading state
    if (recs === undefined) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Empty state
    if (recs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/10 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                    <Clapperboard className="h-8 w-8 text-violet-400" />
                </div>
                <div>
                    <p className="text-base font-medium text-zinc-300">{emptyMessage}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        Add your first recommendation above.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((rec) => (
                <RecommendationCard
                    key={rec._id}
                    rec={rec}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    readOnly={readOnly}
                />
            ))}
        </div>
    );
}
