"use client";

import React, { useEffect, useState } from "react";
import { useContent } from "../../../context/content-context";
import { cn } from "../../../lib/utils";
import { AppProps } from "../../../lib/apps";
import Symbol from "../../symbol";
import Avatar from "../../avatar";
import Sidebar from "../../window/sidebar";
import { Toolbar } from "../../window/toolbar";
import AppearancePane from "./panes/appearance-pane";
import WallpaperPane from "./panes/wallpaper-pane";
import DisplaysPane from "./panes/displays-pane";
import AboutPane from "./panes/about-pane";

type Pane = "appearance" | "wallpaper" | "displays" | "about";

const panes: { id: Pane; label: string; symbol: string; color: string }[] = [
  {
    id: "appearance",
    label: "Appearance",
    symbol: "paintpalette",
    color: "bg-[#3a3a3c]",
  },
  {
    id: "wallpaper",
    label: "Wallpaper",
    symbol: "photo-on-rectangle",
    color: "bg-[#30b0c7]",
  },
  {
    id: "displays",
    label: "Displays",
    symbol: "sun-max",
    color: "bg-[#0a84ff]",
  },
  { id: "about", label: "About", symbol: "info-circle", color: "bg-[#8e8e93]" },
];

const isPane = (value?: string): value is Pane =>
  panes.some((pane) => pane.id === value);

const Settings: React.FC<AppProps> = ({ payload, openedAt }) => {
  const { profile } = useContent();
  const [pane, setPane] = useState<Pane>(
    isPane(payload) ? payload : "appearance"
  );

  useEffect(() => {
    if (isPane(payload)) setPane(payload);
  }, [payload, openedAt]);

  const current = panes.find((p) => p.id === pane)!;

  return (
    <div className="flex h-full">
      <Sidebar
        selectedId={pane}
        onSelect={(id) => setPane(id as Pane)}
        header={
          <button
            onClick={() => setPane("about")}
            className="flex items-center gap-2.5 mx-2.5 mb-3 px-2 py-1.5 rounded-lg text-left cursor-default hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Avatar className="w-9 h-9 text-13" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{profile.name}</div>
              <div className="text-11 text-black/50 dark:text-white/50">
                {profile.role}
              </div>
            </div>
          </button>
        }
        sections={[
          {
            items: panes.map(({ id, label, symbol, color }) => ({
              id,
              label,
              icon: (
                <span
                  className={cn(
                    "w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shadow-sm",
                    color
                  )}
                >
                  <Symbol name={symbol} className="w-3.5 h-3.5 text-white" />
                </span>
              ),
            })),
          },
        ]}
      />
      <section className="flex-grow flex flex-col min-w-0 bg-[#f2f2f7] dark:bg-[#282025]">
        <Toolbar className="max-sm:pl-[92px]" title={current.label} />
        <div className="flex-grow overflow-y-auto px-5 pb-6 space-y-4">
          {pane === "appearance" && <AppearancePane />}
          {pane === "wallpaper" && <WallpaperPane />}
          {pane === "displays" && <DisplaysPane />}
          {pane === "about" && <AboutPane />}
        </div>
      </section>
    </div>
  );
};

export default Settings;
