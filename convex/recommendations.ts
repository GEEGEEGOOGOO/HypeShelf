import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * Extract role from all possible JWT claim locations.
 * 1. Direct top-level "role" (simplest — add "role":"{{user.public_metadata.role}}" in Clerk template)
 * 2. Nested "public_metadata.role" snake_case
 * 3. Nested "publicMetadata.role" camelCase fallback
 */
function getRoleFromIdentity(identity: Record<string, unknown>): string | undefined {
    // #1 Direct top-level claim
    if (typeof identity["role"] === "string") return identity["role"] as string;

    // #2 Nested snake_case
    const pm = identity["public_metadata"];
    if (pm && typeof pm === "object") {
        const r = (pm as Record<string, unknown>)["role"];
        if (typeof r === "string") return r;
    }

    // #3 Nested camelCase
    const pm2 = identity["publicMetadata"];
    if (pm2 && typeof pm2 === "object") {
        const r = (pm2 as Record<string, unknown>)["role"];
        if (typeof r === "string") return r;
    }

    return undefined;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Public query — no auth required.
 * Returns the latest N recommendations (default 6) for the landing page.
 */
export const getPublicLatest = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 6;
        const recs = await ctx.db
            .query("recommendations")
            .order("desc")
            .take(limit);
        return recs;
    },
});

/**
 * Authenticated query — returns all recommendations.
 * Filtering by genre is done client-side (PDR-005).
 */
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        // Return empty array during Clerk hydration window instead of throwing.
        // The /shelf route is already protected server-side by the layout.
        if (!identity) return [];

        const recs = await ctx.db
            .query("recommendations")
            .order("desc")
            .take(100); // PDR-002: guard limit

        return recs;
    },
});


// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create a new recommendation.
 * Auth required. Validates title, blurb length, and URL format.
 * Denormalises userName + userImage from JWT (ADR-003).
 */
export const createRecommendation = mutation({
    args: {
        title: v.string(),
        genre: v.union(
            v.literal("horror"),
            v.literal("action"),
            v.literal("comedy"),
            v.literal("drama"),
            v.literal("sci-fi"),
            v.literal("thriller"),
            v.literal("documentary"),
            v.literal("animation"),
            v.literal("other")
        ),
        link: v.string(),
        blurb: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // Server-side validation
        if (args.title.trim().length === 0) throw new Error("Title is required");
        if (args.title.length > 100) throw new Error("Title must be 100 characters or fewer");
        if (args.blurb.trim().length === 0) throw new Error("Blurb is required");
        if (args.blurb.length > 280) throw new Error("Blurb must be 280 characters or fewer");
        if (!isValidUrl(args.link)) throw new Error("Link must be a valid URL");

        await ctx.db.insert("recommendations", {
            title: args.title.trim(),
            genre: args.genre,
            link: args.link.trim(),
            blurb: args.blurb.trim(),
            userId: identity.subject,
            userName: identity.name ?? identity.email ?? "Anonymous",
            userImage: identity.pictureUrl ?? undefined,
            isStaffPick: false,
        });
    },
});

/**
 * Delete a recommendation.
 * Auth required. RBAC: owner OR admin.
 */
export const deleteRecommendation = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        const role = getRoleFromIdentity(identity as unknown as Record<string, unknown>);
        const isOwner = rec.userId === identity.subject;
        const isAdmin = role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("Forbidden: you can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

/**
 * Toggle Staff Pick status on a recommendation.
 * Auth required. Admin only.
 */
export const markStaffPick = mutation({
    args: {
        id: v.id("recommendations"),
        value: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const role = getRoleFromIdentity(identity as unknown as Record<string, unknown>);
        if (role !== "admin") {
            throw new Error("Forbidden: only admins can mark staff picks");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        await ctx.db.patch(args.id, { isStaffPick: args.value });
    },
});
