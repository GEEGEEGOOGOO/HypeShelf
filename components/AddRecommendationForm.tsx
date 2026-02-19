"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GENRES, GENRE_LABELS, type Genre } from "@/lib/genres";
import { cn } from "@/lib/utils";

// ─── Zod schema ──────────────────────────────────────────────────────────────

const formSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be 100 characters or fewer"),
    genre: z.enum([...GENRES] as [Genre, ...Genre[]]),
    link: z.string().url("Please enter a valid URL"),
    blurb: z
        .string()
        .min(1, "Blurb is required")
        .max(280, "Blurb must be 280 characters or fewer"),
});

type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const EMPTY_FORM: FormData = {
    title: "",
    genre: "other",
    link: "",
    blurb: "",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function AddRecommendationForm() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const createRec = useMutation(api.recommendations.createRecommendation);

    function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
        // Clear error on change
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const result = formSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: FormErrors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof FormData;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setSubmitting(true);
        try {
            await createRec(result.data);
            toast.success("Recommendation added! 🎉");
            setForm(EMPTY_FORM);
            setErrors({});
            setOpen(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/4 backdrop-blur-sm">
            {/* Toggle header */}
            <button
                id="add-rec-toggle"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/4"
            >
                <span className="flex items-center gap-2 font-semibold text-zinc-200">
                    <Plus className="h-4 w-4 text-violet-400" />
                    Add a recommendation
                </span>
                {open ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                )}
            </button>

            {/* Form body */}
            {open && (
                <form
                    id="add-rec-form"
                    onSubmit={handleSubmit}
                    className="border-t border-white/8 px-5 pb-5 pt-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Title */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="rec-title" className="text-xs font-medium text-zinc-400">
                                Title <span className="text-red-400">*</span>
                            </label>
                            <Input
                                id="rec-title"
                                placeholder="e.g. Interstellar"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                maxLength={100}
                                className={cn(
                                    "bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50",
                                    errors.title && "border-red-500/50"
                                )}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-400">{errors.title}</p>
                            )}
                        </div>

                        {/* Genre */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="rec-genre" className="text-xs font-medium text-zinc-400">
                                Genre <span className="text-red-400">*</span>
                            </label>
                            <Select
                                value={form.genre}
                                onValueChange={(v) => setField("genre", v as Genre)}
                            >
                                <SelectTrigger
                                    id="rec-genre"
                                    className={cn(
                                        "bg-white/5 border-white/10 text-zinc-100 focus:ring-violet-500/50",
                                        errors.genre && "border-red-500/50"
                                    )}
                                >
                                    <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-white/10">
                                    {GENRES.map((g) => (
                                        <SelectItem
                                            key={g}
                                            value={g}
                                            className="text-zinc-200 focus:bg-violet-500/20 focus:text-violet-200"
                                        >
                                            {GENRE_LABELS[g]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.genre && (
                                <p className="text-xs text-red-400">{errors.genre}</p>
                            )}
                        </div>

                        {/* Link */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label htmlFor="rec-link" className="text-xs font-medium text-zinc-400">
                                Link <span className="text-red-400">*</span>
                            </label>
                            <Input
                                id="rec-link"
                                type="url"
                                placeholder="https://www.imdb.com/title/..."
                                value={form.link}
                                onChange={(e) => setField("link", e.target.value)}
                                className={cn(
                                    "bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50",
                                    errors.link && "border-red-500/50"
                                )}
                            />
                            {errors.link && (
                                <p className="text-xs text-red-400">{errors.link}</p>
                            )}
                        </div>

                        {/* Blurb */}
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="rec-blurb" className="text-xs font-medium text-zinc-400">
                                    Blurb <span className="text-red-400">*</span>
                                </label>
                                <span
                                    className={cn(
                                        "text-xs tabular-nums",
                                        form.blurb.length > 260 ? "text-red-400" : "text-zinc-600"
                                    )}
                                >
                                    {form.blurb.length}/280
                                </span>
                            </div>
                            <Textarea
                                id="rec-blurb"
                                placeholder="Why are you hyped about this? (max 280 chars)"
                                value={form.blurb}
                                onChange={(e) => setField("blurb", e.target.value)}
                                maxLength={280}
                                rows={3}
                                className={cn(
                                    "resize-none bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50",
                                    errors.blurb && "border-red-500/50"
                                )}
                            />
                            {errors.blurb && (
                                <p className="text-xs text-red-400">{errors.blurb}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-4 flex justify-end">
                        <Button
                            id="add-rec-submit"
                            type="submit"
                            disabled={submitting}
                            className="bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] transition-all"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding…
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to shelf
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
