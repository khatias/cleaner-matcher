"use client";

import React from "react";
import { useFormStatus } from "react-dom";

export default function AuthSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        inline-flex items-center justify-center cursor-pointer
        rounded-lg 
        bg-[var(--color-cocoBlack,#1a1a1a)] text-white
        text-sm font-medium
        px-14 py-3
        transition-all duration-200
        hover:bg-[#2a2a2a]
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 
      `}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
