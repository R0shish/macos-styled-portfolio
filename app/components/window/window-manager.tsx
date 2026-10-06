"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import Window from "./window";
import { getApp } from "../../lib/apps";
import { useWindows } from "../../context/window-context";
import { cn } from "../../lib/utils";
import { MENUBAR_HEIGHT } from "../../lib/constants";

const WindowManager: React.FC = () => {
  const { windows, focusedId, fullscreenId } = useWindows();

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 pointer-events-none",
        fullscreenId ? "z-fullscreen" : "z-windows"
      )}
      style={{ top: MENUBAR_HEIGHT }}
    >
      <AnimatePresence>
        {windows.map((state, index) => {
          const app = getApp(state.id);
          const AppComponent = app.component;

          return (
            <Window
              key={state.id}
              app={app}
              state={state}
              index={index}
              isFocused={focusedId === state.id}
              isHidden={!!fullscreenId && fullscreenId !== state.id}
            >
              <AppComponent payload={state.payload} openedAt={state.openedAt} />
            </Window>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;
