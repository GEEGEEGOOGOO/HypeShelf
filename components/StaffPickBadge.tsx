import { Star } from "lucide-react";

export function StaffPickBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Staff Pick
        </span>
    );
}
