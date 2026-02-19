"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
    id: Id<"recommendations">;
    className?: string;
}

export function DeleteButton({ id, className }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const deleteRec = useMutation(api.recommendations.deleteRecommendation);

    async function handleDelete() {
        if (!confirm("Delete this recommendation?")) return;
        setLoading(true);
        try {
            await deleteRec({ id });
            toast.success("Recommendation deleted");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            id={`delete-rec-${id}`}
            onClick={handleDelete}
            disabled={loading}
            aria-label="Delete recommendation"
            className={cn(
                "rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50",
                className
            )}
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
