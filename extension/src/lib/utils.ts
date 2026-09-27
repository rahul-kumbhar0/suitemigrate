import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"
export const API_BASE = `${APP_URL}/api`
