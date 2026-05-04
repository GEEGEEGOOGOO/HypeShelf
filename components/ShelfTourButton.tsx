"use client";

import { Info } from "lucide-react";
import { driver } from "driver.js";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "driver.js/dist/driver.css";
import "@/app/driver.css";

export function ShelfTourButton() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tourStarted = useRef(false);

    const startTour = () => {
        const driverObj = driver({
            showProgress: false,
            animate: true,
            allowClose: false,
            allowKeyboardControl: false,
            steps: [
                {
                    element: "#add-rec-toggle",
                    popover: {
                        title: "Phase 2: Action Tour",
                        description: "Welcome to The Shelf. Click this button to open the recommendation form.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: () => {
                            const btn = document.querySelector("#add-rec-toggle");
                            if (btn) {
                                const clickHandler = () => {
                                    setTimeout(() => {
                                        driverObj.moveNext();
                                    }, 300);
                                };
                                btn.addEventListener("click", clickHandler, { once: true });
                            }
                        }
                    }
                },
                {
                    element: "#rec-title",
                    popover: {
                        title: "Step 2: Start Typing",
                        description: "Type the name of a movie or show in this box.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: () => {
                            const input = document.querySelector("#rec-title") as HTMLInputElement;
                            if (input) {
                                const typeHandler = (e: Event) => {
                                    if ((e.target as HTMLInputElement).value.length > 2) {
                                        input.removeEventListener("input", typeHandler);
                                        setTimeout(() => driverObj.moveNext(), 300);
                                    }
                                };
                                input.addEventListener("input", typeHandler);
                            }
                        }
                    }
                },
                {
                    element: "#add-rec-submit",
                    popover: {
                        title: "Step 3: Post It",
                        description: "Normally you'd fill out the rest, but for now, click Post and watch it appear instantly.",
                        side: "left",
                        align: "end",
                        popoverClass: "hide-buttons",
                        onPopoverRender: () => {
                            const btn = document.querySelector("#add-rec-submit");
                            if (btn) {
                                btn.addEventListener("click", () => {
                                    setTimeout(() => driverObj.moveNext(), 600);
                                }, { once: true });
                            }
                        }
                    }
                },
                {
                    element: ".genre-filters",
                    popover: {
                        title: "Step 4: Interactive Filters",
                        description: "Click any genre, like Action or Sci-Fi. The feed filters instantly without refreshing.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: () => {
                            const filters = document.querySelectorAll(".genre-filters button");
                            filters.forEach(filter => {
                                filter.addEventListener("click", () => {
                                    setTimeout(() => driverObj.moveNext(), 400);
                                }, { once: true });
                            });
                        }
                    }
                },
                {
                    element: "#staff-pick-filter",
                    popover: {
                        title: "Step 5: Admin Powers",
                        description: "If you're an admin, click this button to curate the feed.",
                        side: "bottom",
                        align: "end",
                        popoverClass: "hide-buttons",
                        onPopoverRender: () => {
                            const btn = document.querySelector("#staff-pick-filter");
                            if (btn) {
                                btn.addEventListener("click", () => {
                                    setTimeout(() => driverObj.moveNext(), 400);
                                }, { once: true });
                            }
                        }
                    }
                },
                {
                    element: ".recs-list article",
                    popover: {
                        title: "Final Step",
                        description: "Hover over a card. Admins can also click the Star icon here to mark it as a Staff Pick.",
                        side: "right",
                        align: "center",
                        showButtons: ["close"],
                        doneBtnText: "Finish Tour"
                    }
                }
            ]
        });
        driverObj.drive();
    };

    useEffect(() => {
        if (searchParams.get("tour") === "true" && !tourStarted.current) {
            tourStarted.current = true;
            setTimeout(() => {
                startTour();
                router.replace("/shelf", { scroll: false });
            }, 500);
        }
    }, [searchParams, router]);

    return (
        <button
            onClick={startTour}
            className="pressable flex items-center gap-2 rounded-md border border-teal-200/25 bg-teal-200/8 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal-100 hover:border-teal-100/45 hover:bg-teal-200/12"
        >
            <Info className="h-3.5 w-3.5" />
            Action Tour
        </button>
    );
}
