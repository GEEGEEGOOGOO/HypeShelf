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
            keyboardControl: false, // Force them to click to continue
            steps: [
                {
                    element: "#add-rec-toggle",
                    popover: {
                        title: "Phase 2: Action Tour 🎬",
                        description: "Welcome to The Shelf! Let's post something. Click this button to open the recommendation form.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: (popover) => {
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
                        title: "Step 2: Start Typing ✍️",
                        description: "Type the name of a movie or show in this box.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: (popover) => {
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
                        title: "Step 3: Post It! 🚀",
                        description: "Normally you'd fill out the rest, but for now, just click Post. Watch it appear instantly!",
                        side: "left",
                        align: "end",
                        popoverClass: "hide-buttons",
                        onPopoverRender: (popover) => {
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
                        title: "Step 4: Interactive Filters 🔍",
                        description: "Click any genre (like 'Action' or 'Sci-Fi'). The feed filters instantly on the client side without refreshing.",
                        side: "bottom",
                        align: "start",
                        popoverClass: "hide-buttons",
                        onPopoverRender: (popover) => {
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
                        title: "Step 5: Admin Powers 👑",
                        description: "Because you're an Admin, click this button to currate the feed. Go ahead, click it!",
                        side: "bottom",
                        align: "end",
                        popoverClass: "hide-buttons",
                        onPopoverRender: (popover) => {
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
                    element: ".recs-list article", // targets the first card
                    popover: {
                        title: "Final Step 🛠️",
                        description: "Hover over a card. Notice the glassmorphism? Admins can also click the Star icon here to mark it as a Staff Pick. You're ready to go!",
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

    // Automatically start if URL contains ?tour=true
    useEffect(() => {
        if (searchParams.get("tour") === "true" && !tourStarted.current) {
            tourStarted.current = true;
            // Small timeout to allow page contents to render fully before taking over
            setTimeout(() => {
                startTour();
                // Clean up the URL so it doesn't trigger again on refresh
                router.replace("/shelf", { scroll: false });
            }, 500);
        }
    }, [searchParams, router]);

    return (
        <button
            onClick={startTour}
            className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200"
        >
            <Info className="h-3.5 w-3.5" />
            Action Tour
        </button>
    );
}
