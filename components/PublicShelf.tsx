import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Clapperboard } from "lucide-react";

export async function PublicShelf() {
    let recs: Doc<"recommendations">[] = [];

    try {
        const result = await fetchQuery(api.recommendations.getPublicLatest, { limit: 6 });
        recs = result as Doc<"recommendations">[];
    } catch {
        // If Convex isn't configured yet, show empty state gracefully
        recs = [];
    }

    if (recs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 border border-dashed border-stone-200/16 bg-stone-950/24 px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-amber-300/24 bg-amber-300/10">
                    <Clapperboard className="h-7 w-7 text-amber-200" />
                </div>
                <p className="text-sm text-stone-500">
                    No recommendations yet. Sign in and be the first!
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((rec) => (
                <RecommendationCard key={rec._id} rec={rec} readOnly />
            ))}
        </div>
    );
}
