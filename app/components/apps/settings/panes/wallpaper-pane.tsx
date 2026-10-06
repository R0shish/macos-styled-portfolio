"use client";

import React from "react";
import Image from "next/image";
import { useSystem } from "../../../../context/system-context";
import { useContent } from "../../../../context/content-context";
import { cn } from "../../../../lib/utils";
import { SettingsGroup } from "../settings-ui";

const WallpaperPane: React.FC = () => {
  const { wallpaper, setWallpaper } = useSystem();
  const { wallpapers } = useContent().system;
  const current = wallpapers.find((w) => w.id === wallpaper) ?? wallpapers[0];

  return (
    <>
      <SettingsGroup>
        <div className="flex items-center gap-4 py-3">
          <div
            className="relative w-36 aspect-video rounded-lg overflow-hidden ring-1 ring-black/10"
            style={{ background: current.gradient }}
          >
            {current.src && (
              <Image
                src={current.src}
                alt={current.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-semibold">{current.name}</div>
            <div className="text-12 text-black/50 dark:text-white/50">
              {current.src ? "Picture" : "Color"}
            </div>
          </div>
        </div>
      </SettingsGroup>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {wallpapers.map((item) => (
          <button
            key={item.id}
            onClick={() => setWallpaper(item.id)}
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden ring-1 ring-black/10 cursor-default",
              wallpaper === item.id &&
                "ring-[3px] ring-[#0a84ff] ring-offset-2 ring-offset-[#f2f2f7] dark:ring-offset-[#282025]"
            )}
            style={{ background: item.gradient }}
            title={item.name}
          >
            {item.src && (
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default WallpaperPane;
