"use client";

import { cn } from "@/lib/utils";
import { GENRES, GENRE_LABELS, type Genre } from "@/lib/genres";

interface GenreFilterProps {
    selected: Genre | "all";
    onChange: (genre: Genre | "all") => void;
}

export function GenreFilter({ selected, onChange }: GenreFilterProps) {
    return (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            <button
                id="genre-filter-all"
                onClick={() => onChange("all")}
                className={cn(
                    "pressable shrink-0 rounded-md border px-4 py-2 text-sm font-black",
                    selected === "all"
                        ? "border-amber-300/55 bg-amber-300/18 text-amber-100 shadow-[0_14px_34px_rgba(217,151,61,0.14)]"
                        : "border-stone-200/12 bg-stone-950/28 text-stone-400 hover:border-amber-200/35 hover:bg-amber-200/8 hover:text-stone-100"
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
                        "pressable shrink-0 rounded-md border px-4 py-2 text-sm font-black",
                        selected === genre
                            ? "border-amber-300/55 bg-amber-300/18 text-amber-100 shadow-[0_14px_34px_rgba(217,151,61,0.14)]"
                            : "border-stone-200/12 bg-stone-950/28 text-stone-400 hover:border-amber-200/35 hover:bg-amber-200/8 hover:text-stone-100"
                    )}
                >
                    {GENRE_LABELS[genre]}
                </button>
            ))}
        </div>
    );
}
