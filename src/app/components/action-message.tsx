"use client";

export function ActionMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={`mt-4 rounded-xl p-3 text-sm ${message.startsWith("We") || message.startsWith("Please") || message.startsWith("You") ? "bg-red-50 text-red-700" : "bg-[#edf7d2] text-[#3d5420]"}`}>{message}</p>;
}
