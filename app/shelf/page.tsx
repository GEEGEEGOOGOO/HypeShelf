"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AddRecommendationForm } from "@/components/AddRecommendationForm";
import { GenreFilter } from "@/components/GenreFilter";
import { RecommendationList } from "@/components/RecommendationList";
import { type Genre } from "@/lib/genres";
import { Star, Layers } from "lucide-react";

type SelectedGenre = Genre | "all";

export default function ShelfPage() {
    const { user } = useUser();
    const recs = useQuery(api.recommendations.getAll);
    const [genreFilter, setGenreFilter] = useState<SelectedGenre>("all");
    const [staffPickOnly, setStaffPickOnly] = useState(false);

    // Derive role from Clerk publicMetadata
    const isAdmin =
        (user?.publicMetadata as { role?: string } | undefined)?.role === "admin";
    const currentUserId = user?.id;

    // Client-side filtering (PDR-005)
    const typedRecs = recs as Doc<"recommendations">[] | undefined;
    const filtered: Doc<"recommendations">[] | undefined = typedRecs
        ? typedRecs.filter((rec: Doc<"recommendations">) => {
            if (staffPickOnly && !rec.isStaffPick) return false;
            if (genreFilter !== "all" && rec.genre !== genreFilter) return false;
            return true;
        })
        : undefined;


    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
                    The Shelf
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                    {recs !== undefined
                        ? `${recs.length} recommendation${recs.length !== 1 ? "s" : ""} from your crew`
                        : "Loading…"}
                </p>
            </div>

            {/* Add form */}
            <div className="mb-8">
                <AddRecommendationForm />
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <GenreFilter selected={genreFilter} onChange={setGenreFilter} />

                {/* Staff pick toggle */}
                <button
                    id="staff-pick-filter"
                    onClick={() => setStaffPickOnly((v) => !v)}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${staffPickOnly
                        ? "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200"
                        }`}
                >
                    <Star
                        className={`h-3.5 w-3.5 ${staffPickOnly ? "fill-amber-400 text-amber-400" : ""}`}
                    />
                    Staff Picks
                </button>
            </div>

            {/* Results count when filtering */}
            {(genreFilter !== "all" || staffPickOnly) && filtered !== undefined && (
                <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
                    <Layers className="h-4 w-4" />
                    <span>
                        Showing {filtered.length} of {recs?.length ?? 0} recommendations
                    </span>
                </div>
            )}

            {/* Recommendation list */}
            <RecommendationList
                recs={filtered}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                emptyMessage={
                    genreFilter !== "all" || staffPickOnly
                        ? "No recommendations match this filter."
                        : "No recommendations yet — be the first!"
                }
            />
        </div>
    );
}
