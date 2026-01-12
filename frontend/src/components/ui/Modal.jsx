"use client";

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children, className }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className={cn(
          "relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 animate-slide-up",
          className
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-outfit text-secondary-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
