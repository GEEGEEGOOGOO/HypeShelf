"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AddRecommendationForm } from "@/components/AddRecommendationForm";
import { GenreFilter } from "@/components/GenreFilter";
import { RecommendationList } from "@/components/RecommendationList";
import { ShelfTourButton } from "@/components/ShelfTourButton";
import { type Genre } from "@/lib/genres";
import { Layers, Star } from "lucide-react";

type SelectedGenre = Genre | "all";

export default function ShelfPage() {
    const { user } = useUser();
    const recs = useQuery(api.recommendations.getAll);
    const [genreFilter, setGenreFilter] = useState<SelectedGenre>("all");
    const [staffPickOnly, setStaffPickOnly] = useState(false);

    const isAdmin =
        (user?.publicMetadata as { role?: string } | undefined)?.role === "admin";
    const currentUserId = user?.id;

    const typedRecs = recs as Doc<"recommendations">[] | undefined;
    const filtered: Doc<"recommendations">[] | undefined = typedRecs
        ? typedRecs.filter((rec: Doc<"recommendations">) => {
            if (staffPickOnly && !rec.isStaffPick) return false;
            if (genreFilter !== "all" && rec.genre !== genreFilter) return false;
            return true;
        })
        : undefined;

    return (
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:py-12">
            <div className="mb-8 flex flex-col gap-5 border-b border-stone-200/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200/65">
                        Private Room
                    </p>
                    <h1 className="font-display mt-2 text-5xl font-black tracking-normal text-stone-50 sm:text-6xl">
                        The Shelf
                    </h1>
                    <p className="mt-3 text-sm text-stone-400">
                        {recs !== undefined
                            ? `${recs.length} recommendation${recs.length !== 1 ? "s" : ""} from your crew`
                            : "Loading..."}
                    </p>
                </div>
                <ShelfTourButton />
            </div>

            <div className="add-rec-form mb-8">
                <AddRecommendationForm />
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="genre-filters">
                    <GenreFilter selected={genreFilter} onChange={setGenreFilter} />
                </div>

                <button
                    id="staff-pick-filter"
                    onClick={() => setStaffPickOnly((v) => !v)}
                    className={`pressable flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm font-black ${staffPickOnly
                        ? "border-amber-300/55 bg-amber-300/18 text-amber-100 shadow-[0_14px_34px_rgba(217,151,61,0.14)]"
                        : "border-stone-200/12 bg-stone-950/28 text-stone-400 hover:border-amber-200/35 hover:bg-amber-200/8 hover:text-stone-100"
                        }`}
                >
                    <Star
                        className={`h-3.5 w-3.5 ${staffPickOnly ? "fill-amber-300 text-amber-300" : ""}`}
                    />
                    Staff Picks
                </button>
            </div>

            {(genreFilter !== "all" || staffPickOnly) && filtered !== undefined && (
                <div className="mb-4 flex items-center gap-2 text-sm text-stone-400">
                    <Layers className="h-4 w-4 text-amber-200/70" />
                    <span>
                        Showing {filtered.length} of {recs?.length ?? 0} recommendations
                    </span>
                </div>
            )}

            <div className="recs-list">
                <RecommendationList
                    recs={filtered}
                    currentUserId={currentUserId}
                    isAdmin={isAdmin}
                    emptyMessage={
                        genreFilter !== "all" || staffPickOnly
                            ? "No recommendations match this filter."
                            : "No recommendations yet - be the first!"
                    }
                />
            </div>
        </div>
    );
}
