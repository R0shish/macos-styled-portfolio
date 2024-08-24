"use client";

import Draggable, { DraggableEventHandler } from "react-draggable";
import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { FaTimes, FaMinus, FaExpandAlt } from "react-icons/fa";

interface WindowProps {
  defaultPosition?: { x: number; y: number };
  onStop?: DraggableEventHandler;
}

type ResizeDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw"
  | "nil";

const Window: React.FC<WindowProps> = ({
  defaultPosition = { x: 650, y: 200 },
  onStop,
}) => {
  const [size, setSize] = useState({ width: 384, height: 384 });
  const [position, setPosition] = useState(defaultPosition);
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection>("nil");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (windowRef.current) {
      const { width, height, right, bottom } =
        windowRef.current.getBoundingClientRect();
      const maxWidth = window.innerWidth - position.x - 20;
      const maxHeight = window.innerHeight - position.y - 20;

      setSize({
        width: Math.min(width, maxWidth),
        height: Math.min(height, maxHeight),
      });

      if (right > window.innerWidth) {
        setPosition((prev) => ({ ...prev, x: window.innerWidth - width - 20 }));
      }
      if (bottom > window.innerHeight) {
        setPosition((prev) => ({
          ...prev,
          y: window.innerHeight - height - 20,
        }));
      }
    }
  }, [position.x, position.y]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!windowRef.current || !resizeDirection) return;

      const { left, top, right, bottom } =
        windowRef.current.getBoundingClientRect();
      const minSize = 200;
      const maxWidth = window.innerWidth - position.x - 20;
      const maxHeight = window.innerHeight - position.y - 20;

      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeDirection.includes("e")) {
        newWidth = Math.max(minSize, Math.min(e.clientX - left, maxWidth));
      }
      if (resizeDirection.includes("w")) {
        const diff = left - e.clientX;
        newWidth = Math.max(
          minSize,
          Math.min(size.width + diff, right - e.clientX)
        );
        newX = Math.max(0, position.x - diff);
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(minSize, Math.min(e.clientY - top, maxHeight));
      }
      if (resizeDirection.includes("n")) {
        const diff = top - e.clientY;
        newHeight = Math.max(
          minSize,
          Math.min(size.height + diff, bottom - e.clientY)
        );
        newY = Math.max(0, position.y - diff);
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    },
    [resizeDirection, size, position]
  );

  const handleMouseUp = useCallback(() => {
    setResizeDirection("nil");
  }, []);

  useEffect(() => {
    if (resizeDirection != "nil") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeDirection, handleMouseMove, handleMouseUp]);

  const resizeHandlers: Record<ResizeDirection, string> = {
    n: "cursor-ns-resize",
    s: "cursor-ns-resize",
    e: "cursor-ew-resize",
    w: "cursor-ew-resize",
    ne: "cursor-nesw-resize",
    nw: "cursor-nwse-resize",
    se: "cursor-nwse-resize",
    sw: "cursor-nesw-resize",
    nil: "",
  };

  return (
    <Draggable
      axis="both"
      handle=".handle"
      position={position}
      bounds={{
        top: 0,
      }}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        onStop && onStop(e, data);
      }}
    >
      <div
        ref={windowRef}
        className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col relative ${
          isTransitioning ? "transition-all duration-300 ease-in-out" : ""
        }`}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <WindowTitleBar
          onMaximize={() => {
            setIsTransitioning(true);
            if (
              size.height === window.innerHeight - 30 &&
              size.width === window.innerWidth
            ) {
              setSize({ width: 384, height: 384 });
              setPosition(defaultPosition);
            } else {
              setPosition({ x: 0, y: 0 });
              setSize({
                width: window.innerWidth,
                height: window.innerHeight - 30,
              });
            }
            setTimeout(() => setIsTransitioning(false), 300);
          }}
          onClose={() => console.log("close")}
          onMinimize={() => console.log("minimize")}
        />
        <div className="flex-grow" />
        {(Object.keys(resizeHandlers) as ResizeDirection[]).map(
          (direction) =>
            direction && (
              <div
                key={direction}
                className={`absolute ${resizeHandlers[direction]}`}
                style={{
                  ...(direction.includes("n") && {
                    top: "-5px",
                    height: "10px",
                  }),
                  ...(direction.includes("s") && {
                    bottom: "-5px",
                    height: "10px",
                  }),
                  ...(direction.includes("e") && {
                    right: "-5px",
                    width: "10px",
                  }),
                  ...(direction.includes("w") && {
                    left: "-5px",
                    width: "10px",
                  }),
                  ...(direction.length === 1 && { width: "100%" }),
                  ...(direction.length === 2 && { height: "100%" }),
                }}
                onMouseDown={() => setResizeDirection(direction)}
              />
            )
        )}
      </div>
    </Draggable>
  );
};

type WindowTitleBarProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
};

const WindowTitleBar: React.FC<WindowTitleBarProps> = memo(
  ({ onClose, onMinimize, onMaximize }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="handle h-8 bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-between px-2"
        onDoubleClick={onMaximize}
      >
        <div
          className="flex"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <WindowControlButton
            color="bg-red-500"
            isHovered={isHovered}
            icon={<FaTimes className="text-black w-2 h-2" />}
            onClick={onClose}
          />
          <WindowControlButton
            color="bg-yellow-500"
            isHovered={isHovered}
            icon={<FaMinus className="text-black w-2 h-2" />}
            onClick={onMinimize}
          />
          <WindowControlButton
            color="bg-green-500"
            isHovered={isHovered}
            onClick={onMaximize}
            icon={<FaExpandAlt className="text-black w-2 h-2" />}
          />
        </div>
      </div>
    );
  }
);

interface WindowControlButtonProps {
  color: string;
  icon: React.ReactNode;
  isHovered?: boolean;
  onClick: () => void;
}

const WindowControlButton: React.FC<WindowControlButtonProps> = memo(
  ({ color, icon, isHovered, onClick }) => {
    return (
      <div
        className={`w-3 h-3 ${color} rounded-full mr-2 last:mr-0 flex items-center justify-center transition-colors duration-200 z-99`}
        onClick={onClick}
      >
        {isHovered && icon}
      </div>
    );
  }
);

export default memo(Window);
