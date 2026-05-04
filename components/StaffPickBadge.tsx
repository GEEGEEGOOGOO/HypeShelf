import { Star } from "lucide-react";

export function StaffPickBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/40 bg-amber-300/12 px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-amber-100">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            Staff Pick
        </span>
    );
}
