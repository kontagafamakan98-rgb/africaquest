import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

// Hide an <img> that failed to load so the gradient behind it shows through
// instead of leaving a broken image on screen.
export const hideBrokenImage = (event) => {
  event.currentTarget.style.display = "none";
};

