"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaffPickBadge } from "@/components/StaffPickBadge";
import { DeleteButton } from "@/components/DeleteButton";
import { GENRE_COLORS, GENRE_LABELS, type Genre } from "@/lib/genres";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
    rec: Doc<"recommendations">;
    currentUserId?: string;
    isAdmin?: boolean;
    /** If true, hides all interactive controls (public landing page) */
    readOnly?: boolean;
}

function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function RecommendationCard({
    rec,
    currentUserId,
    isAdmin,
    readOnly = false,
}: RecommendationCardProps) {
    const [staffPickLoading, setStaffPickLoading] = useState(false);
    const markStaffPick = useMutation(api.recommendations.markStaffPick);

    const canDelete = !readOnly && (isAdmin || rec.userId === currentUserId);
    const canToggleStaffPick = !readOnly && isAdmin;

    async function handleStaffPickToggle() {
        setStaffPickLoading(true);
        try {
            await markStaffPick({ id: rec._id, value: !rec.isStaffPick });
            toast.success(rec.isStaffPick ? "Staff pick removed" : "Marked as staff pick ⭐");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to update";
            toast.error(message);
        } finally {
            setStaffPickLoading(false);
        }
    }

    return (
        <article
            className={cn(
                "group relative flex flex-col gap-3 rounded-xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm transition-all duration-300",
                "hover:border-white/15 hover:bg-white/6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                rec.isStaffPick && "border-amber-500/20 bg-amber-500/4"
            )}
        >
            {/* Top row: genre badge + staff pick badge */}
            <div className="flex items-center justify-between gap-2">
                <span
                    className={cn(
                        "inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        GENRE_COLORS[rec.genre as Genre]
                    )}
                >
                    {GENRE_LABELS[rec.genre as Genre]}
                </span>
                {rec.isStaffPick && <StaffPickBadge />}
            </div>

            {/* Title */}
            <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-start gap-1.5"
                id={`rec-link-${rec._id}`}
            >
                <h3 className="text-base font-semibold leading-snug text-zinc-100 transition-colors group-hover/link:text-violet-300">
                    {rec.title}
                </h3>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500 transition-colors group-hover/link:text-violet-400" />
            </a>

            {/* Blurb */}
            <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">{rec.blurb}</p>

            {/* Footer: author + time + actions */}
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={rec.userImage} alt={rec.userName} />
                        <AvatarFallback className="bg-violet-900/60 text-violet-200 text-xs">
                            {getInitials(rec.userName)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-xs text-zinc-500">
                        <span className="text-zinc-400">{rec.userName}</span>
                        {" · "}
                        {timeAgo(rec._creationTime)}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center gap-1">
                    {canToggleStaffPick && (
                        <button
                            id={`staff-pick-${rec._id}`}
                            onClick={handleStaffPickToggle}
                            disabled={staffPickLoading}
                            aria-label={rec.isStaffPick ? "Remove staff pick" : "Mark as staff pick"}
                            className={cn(
                                "rounded-md p-1.5 transition-colors disabled:opacity-50",
                                rec.isStaffPick
                                    ? "text-amber-400 hover:bg-amber-500/10"
                                    : "text-zinc-500 hover:bg-amber-500/10 hover:text-amber-400"
                            )}
                        >
                            <Star
                                className={cn("h-4 w-4", rec.isStaffPick && "fill-amber-400")}
                            />
                        </button>
                    )}
                    {canDelete && <DeleteButton id={rec._id} />}
                </div>
            </div>
        </article>
    );
}
