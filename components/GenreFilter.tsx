"use client";

import { cn } from "@/lib/utils";
import { GENRES, GENRE_LABELS, type Genre } from "@/lib/genres";

interface GenreFilterProps {
    selected: Genre | "all";
    onChange: (genre: Genre | "all") => void;
}

export function GenreFilter({ selected, onChange }: GenreFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* "All" pill */}
            <button
                id="genre-filter-all"
                onClick={() => onChange("all")}
                className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    selected === "all"
                        ? "border-violet-500 bg-violet-500/20 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200"
                )}
            >
                All
            </button>

            {GENRES.map((genre) => (
                <button
                    key={genre}
                    id={`genre-filter-${genre}`}
                    onClick={() => onChange(genre)}
                    className={cn(
                        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                        selected === genre
                            ? "border-violet-500 bg-violet-500/20 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200"
                    )}
                >
                    {GENRE_LABELS[genre]}
                </button>
            ))}
        </div>
    );
}
