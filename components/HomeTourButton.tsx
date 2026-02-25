"use client";

import { Play } from "lucide-react";
import { driver, DriveStep } from "driver.js";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "driver.js/dist/driver.css";
import "@/app/driver.css"; // custom overrides

export function HomeTourButton() {
  const router = useRouter();
  const { isSignedIn } = useAuth(); // Check if user is logged in

  const startTour = () => {
    // Base steps everyone sees
    const steps: DriveStep[] = [
      {
        element: ".hero-heading",
        popover: {
          title: "Welcome to HypeShelf! 🎬",
          description: "This is a quick interactive tour. Click 'Next' to continue.",
          side: "bottom",
          align: "center",
          showButtons: ["next"]
        }
      },
      {
        element: ".latest-shelf-section",
        popover: {
          title: "Discover 🌍",
          description: "See what the community is hyping without even logging in. Click 'Next'.",
          side: "top",
          align: "center",
          showButtons: ["next"]
        }
      }
    ];

    // Final step changes based on auth state
    if (!isSignedIn) {
      steps.push({
        element: "#hero-sign-in",
        popover: {
          title: "Your Turn! 🚀",
          description: "Click 'Get started — it's free' right now to securely authenticate and jump into the actual app!",
          side: "bottom",
          align: "center",
          popoverClass: "hide-buttons", // strictly block progression until they click
          onPopoverRender: (popover) => {
            const btn = document.querySelector("#hero-sign-in");
            if (btn) {
              btn.addEventListener("click", () => {
                // It will navigate away on its own since it's a clerk button
                setTimeout(() => driverObj.destroy(), 500);
              });
            }
          }
        }
      });
    } else {
      steps.push({
        element: "#hero-go-to-shelf",
        popover: {
          title: "Your Turn! 🚀",
          description: "You're already signed in! Click 'Go to my shelf' right now. We will seamlessly transition into the Action Tour!",
          side: "bottom",
          align: "center",
          popoverClass: "hide-buttons", // strictly block progression until they click
          onPopoverRender: (popover) => {
            const btn = document.querySelector("#hero-go-to-shelf");
            if (btn) {
              btn.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent standard link behavior
                setTimeout(() => driverObj.destroy(), 100);
                // Force navigation manually and append the query param
                router.push("/shelf?tour=true");
              });
            }
          }
        }
      });
    }

    const driverObj = driver({
      showProgress: false,
      animate: true,
      allowClose: false,
      allowKeyboardControl: false, // force interaction
      steps: steps
    });

    driverObj.drive();
  };

  return (
    <button
      onClick={startTour}
      className="flex items-center gap-2 rounded-xl bg-zinc-800/80 border border-white/10 px-8 py-3.5 text-base font-semibold text-zinc-300 shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all hover:bg-zinc-700 hover:text-white"
    >
      <Play className="h-4 w-4 text-violet-400" />
      Interactive Tour
    </button>
  );
}
