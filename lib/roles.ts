import { auth } from "@clerk/nextjs/server";

export type Role = "admin" | "user";

/**
 * Server-only helper — reads the current user's role from Clerk session claims.
 * Returns null if unauthenticated or no role is set.
 */
export async function getCurrentRole(): Promise<Role | null> {
    const { sessionClaims } = await auth();
    return (sessionClaims?.metadata as { role?: Role } | undefined)?.role ?? null;
}
