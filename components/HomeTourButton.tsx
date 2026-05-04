"use client";

import { Play } from "lucide-react";
import { driver, DriveStep } from "driver.js";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import "driver.js/dist/driver.css";
import "@/app/driver.css";

export function HomeTourButton() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const startTour = () => {
    const steps: DriveStep[] = [
      {
        element: ".hero-heading",
        popover: {
          title: "Welcome to HypeShelf",
          description: "This is a quick interactive tour. Click Next to continue.",
          side: "bottom",
          align: "center",
          showButtons: ["next"]
        }
      },
      {
        element: ".latest-shelf-section",
        popover: {
          title: "Discover",
          description: "See what the community is hyping without logging in. Click Next.",
          side: "top",
          align: "center",
          showButtons: ["next"]
        }
      }
    ];

    if (!isSignedIn) {
      steps.push({
        element: "#hero-sign-in",
        popover: {
          title: "Your Turn",
          description: "Click Get started to securely authenticate and jump into the app.",
          side: "bottom",
          align: "center",
          popoverClass: "hide-buttons",
          onPopoverRender: () => {
            const btn = document.querySelector("#hero-sign-in");
            if (btn) {
              btn.addEventListener("click", () => {
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
          title: "Your Turn",
          description: "You're already signed in. Click Go to my shelf to continue into the action tour.",
          side: "bottom",
          align: "center",
          popoverClass: "hide-buttons",
          onPopoverRender: () => {
            const btn = document.querySelector("#hero-go-to-shelf");
            if (btn) {
              btn.addEventListener("click", (e) => {
                e.preventDefault();
                setTimeout(() => driverObj.destroy(), 100);
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
      allowKeyboardControl: false,
      steps
    });

    driverObj.drive();
  };

  return (
    <button
      onClick={startTour}
      className="pressable flex items-center gap-2 rounded-md border border-stone-200/14 bg-stone-950/34 px-7 py-3.5 text-base font-black text-stone-200 shadow-[0_18px_52px_rgba(0,0,0,0.22)] hover:border-teal-200/35 hover:bg-teal-200/8 hover:text-stone-50"
    >
      <Play className="h-4 w-4 text-teal-200" />
      Interactive Tour
    </button>
  );
}
