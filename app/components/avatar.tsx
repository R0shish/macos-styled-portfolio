"use client";

import React from "react";
import { cn } from "../lib/utils";
import { useContent } from "../context/content-context";

const Avatar: React.FC<{ className?: string }> = ({ className }) => {
  const { initials } = useContent().profile;

  return (
    <div
      className={cn(
        "shrink-0 rounded-full bg-gradient-to-b from-[#a8adb8] to-[#7e838f] flex items-center justify-center text-white font-medium tracking-wide",
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
