"use client";

import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-2xl bg-purple-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-purple-900

      00
      "
    >
      {children}
    </button>
  );
}
