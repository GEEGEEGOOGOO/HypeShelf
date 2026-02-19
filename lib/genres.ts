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
    horror: "bg-red-900/80 text-red-200 border-red-700/50",
    action: "bg-orange-900/80 text-orange-200 border-orange-700/50",
    comedy: "bg-yellow-900/80 text-yellow-200 border-yellow-700/50",
    drama: "bg-blue-900/80 text-blue-200 border-blue-700/50",
    "sci-fi": "bg-cyan-900/80 text-cyan-200 border-cyan-700/50",
    thriller: "bg-purple-900/80 text-purple-200 border-purple-700/50",
    documentary: "bg-green-900/80 text-green-200 border-green-700/50",
    animation: "bg-pink-900/80 text-pink-200 border-pink-700/50",
    other: "bg-zinc-800/80 text-zinc-300 border-zinc-600/50",
};
