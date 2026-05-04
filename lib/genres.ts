export const GENRES = [
    "horror",
    "action",
    "comedy",
    "drama",
    "sci-fi",
    "thriller",
    "documentary",
    "animation",
    "other",
] as const;

export type Genre = (typeof GENRES)[number];

/** Human-readable label for each genre */
export const GENRE_LABELS: Record<Genre, string> = {
    horror: "Horror",
    action: "Action",
    comedy: "Comedy",
    drama: "Drama",
    "sci-fi": "Sci-Fi",
    thriller: "Thriller",
    documentary: "Documentary",
    animation: "Animation",
    other: "Other",
};

/** Tailwind colour classes for genre badges */
export const GENRE_COLORS: Record<Genre, string> = {
    horror: "bg-red-400/12 text-red-100 border-red-300/28",
    action: "bg-orange-300/14 text-orange-100 border-orange-200/30",
    comedy: "bg-yellow-300/14 text-yellow-100 border-yellow-200/30",
    drama: "bg-sky-300/12 text-sky-100 border-sky-200/28",
    "sci-fi": "bg-teal-300/12 text-teal-100 border-teal-200/30",
    thriller: "bg-fuchsia-300/12 text-fuchsia-100 border-fuchsia-200/28",
    documentary: "bg-emerald-300/12 text-emerald-100 border-emerald-200/28",
    animation: "bg-pink-300/12 text-pink-100 border-pink-200/28",
    other: "bg-stone-200/10 text-stone-200 border-stone-200/18",
};
