"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
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

export function AddRecommendationForm() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const createRec = useMutation(api.recommendations.createRecommendation);

    function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
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
            toast.success("Recommendation added");
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
        <div className="overflow-hidden border border-stone-200/12 bg-stone-950/28 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm">
            <button
                id="add-rec-toggle"
                onClick={() => setOpen((v) => !v)}
                className="pressable flex w-full items-center justify-between px-5 py-4 text-left hover:bg-amber-200/6"
            >
                <span className="flex items-center gap-2 font-black text-stone-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-300/24 bg-amber-300/10">
                        <Plus className="h-4 w-4 text-amber-200" />
                    </span>
                    Add a recommendation
                </span>
                {open ? (
                    <ChevronUp className="h-4 w-4 text-stone-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-stone-500" />
                )}
            </button>

            {open && (
                <form
                    id="add-rec-form"
                    onSubmit={handleSubmit}
                    className="border-t border-stone-200/10 px-5 pb-5 pt-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="rec-title" className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
                                Title <span className="text-red-300">*</span>
                            </label>
                            <Input
                                id="rec-title"
                                placeholder="e.g. Interstellar"
                                value={form.title}
                                onChange={(e) => setField("title", e.target.value)}
                                maxLength={100}
                                className={cn(
                                    "border-stone-200/12 bg-stone-950/40 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-300/35",
                                    errors.title && "border-red-400/60"
                                )}
                            />
                            {errors.title && <p className="text-xs text-red-300">{errors.title}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="rec-genre" className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
                                Genre <span className="text-red-300">*</span>
                            </label>
                            <Select
                                value={form.genre}
                                onValueChange={(v) => setField("genre", v as Genre)}
                            >
                                <SelectTrigger
                                    id="rec-genre"
                                    className={cn(
                                        "w-full border-stone-200/12 bg-stone-950/40 text-stone-100 focus:ring-amber-300/35",
                                        errors.genre && "border-red-400/60"
                                    )}
                                >
                                    <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                                <SelectContent className="border-stone-200/12 bg-stone-950 text-stone-100">
                                    {GENRES.map((g) => (
                                        <SelectItem
                                            key={g}
                                            value={g}
                                            className="cursor-pointer text-stone-200 focus:bg-amber-300/14 focus:text-amber-100"
                                        >
                                            {GENRE_LABELS[g]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.genre && <p className="text-xs text-red-300">{errors.genre}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label htmlFor="rec-link" className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
                                Link <span className="text-red-300">*</span>
                            </label>
                            <Input
                                id="rec-link"
                                type="url"
                                placeholder="https://www.imdb.com/title/..."
                                value={form.link}
                                onChange={(e) => setField("link", e.target.value)}
                                className={cn(
                                    "border-stone-200/12 bg-stone-950/40 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-300/35",
                                    errors.link && "border-red-400/60"
                                )}
                            />
                            {errors.link && <p className="text-xs text-red-300">{errors.link}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="rec-blurb" className="text-xs font-black uppercase tracking-[0.12em] text-stone-400">
                                    Blurb <span className="text-red-300">*</span>
                                </label>
                                <span
                                    className={cn(
                                        "text-xs tabular-nums",
                                        form.blurb.length > 260 ? "text-red-300" : "text-stone-600"
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
                                    "resize-none border-stone-200/12 bg-stone-950/40 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-300/35",
                                    errors.blurb && "border-red-400/60"
                                )}
                            />
                            {errors.blurb && <p className="text-xs text-red-300">{errors.blurb}</p>}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            id="add-rec-submit"
                            type="submit"
                            disabled={submitting}
                            className="pressable bg-amber-300 font-black text-stone-950 shadow-[0_14px_34px_rgba(217,151,61,0.22)] hover:bg-amber-200"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
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
