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
            toast.success(rec.isStaffPick ? "Staff pick removed" : "Marked as staff pick");
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
                "group relative flex min-h-64 flex-col gap-4 overflow-hidden border border-stone-200/10 bg-stone-950/32 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm",
                "transition-[border-color,background-color,box-shadow] duration-200 hover:border-amber-200/28 hover:bg-stone-900/46 hover:shadow-[0_30px_80px_rgba(0,0,0,0.32)]",
                "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-amber-300/70 before:via-orange-300/70 before:to-teal-300/60 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
                rec.isStaffPick && "border-amber-300/24 bg-amber-300/7 before:opacity-100"
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span
                    className={cn(
                        "inline-block rounded-md border px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em]",
                        GENRE_COLORS[rec.genre as Genre]
                    )}
                >
                    {GENRE_LABELS[rec.genre as Genre]}
                </span>
                {rec.isStaffPick && <StaffPickBadge />}
            </div>

            <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-start gap-2"
                id={`rec-link-${rec._id}`}
            >
                <h3 className="font-display text-2xl font-black leading-[1.02] text-stone-50 transition-colors duration-200 group-hover/link:text-amber-100">
                    {rec.title}
                </h3>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-stone-500 transition-colors duration-200 group-hover/link:text-amber-200" />
            </a>

            <p className="line-clamp-3 text-sm leading-6 text-stone-400">{rec.blurb}</p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-200/10 pt-4">
                <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-7 w-7 shrink-0 border border-stone-200/14">
                        <AvatarImage src={rec.userImage} alt={rec.userName} />
                        <AvatarFallback className="bg-amber-300/15 text-xs font-black text-amber-100">
                            {getInitials(rec.userName)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-xs text-stone-500">
                        <span className="font-semibold text-stone-300">{rec.userName}</span>
                        {" / "}
                        {timeAgo(rec._creationTime)}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    {canToggleStaffPick && (
                        <button
                            id={`staff-pick-${rec._id}`}
                            onClick={handleStaffPickToggle}
                            disabled={staffPickLoading}
                            aria-label={rec.isStaffPick ? "Remove staff pick" : "Mark as staff pick"}
                            className={cn(
                                "pressable rounded-md p-1.5 disabled:opacity-50",
                                rec.isStaffPick
                                    ? "text-amber-300 hover:bg-amber-300/10"
                                    : "text-stone-500 hover:bg-amber-300/10 hover:text-amber-300"
                            )}
                        >
                            <Star
                                className={cn("h-4 w-4", rec.isStaffPick && "fill-amber-300")}
                            />
                        </button>
                    )}
                    {canDelete && <DeleteButton id={rec._id} />}
                </div>
            </div>
        </article>
    );
}
