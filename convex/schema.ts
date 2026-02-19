import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    recommendations: defineTable({
        // Content
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
        link: v.string(),   // URL to the movie/show
        blurb: v.string(),  // max 280 chars enforced in mutation

        // Authorship (denormalised at write time)
        userId: v.string(),
        userName: v.string(),
        userImage: v.optional(v.string()),

        // Admin fields
        isStaffPick: v.boolean(),
    })
        .index("by_user", ["userId"])
        .index("by_genre", ["genre"])
        .index("by_staff_pick", ["isStaffPick"]),
});
