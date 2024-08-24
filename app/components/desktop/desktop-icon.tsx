"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

interface DesktopIconProps {
  initialPosition: { x: number; y: number };
  iconLabel: string;
  iconImage: StaticImageData;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  initialPosition,
  iconImage,
  iconLabel,
  isSelected,
  onSelect,
  onDoubleClick,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onSelect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (window.innerWidth - position.x - 110),
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const constrainedX = Math.max(
        85,
        Math.min(e.clientX, window.innerWidth - 30)
      );
      const constrainedY = Math.max(
        85,
        Math.min(e.clientY - 85, window.innerHeight - 85)
      );

      const newX = window.innerWidth - constrainedX - dragOffset.x;
      const newY = constrainedY - dragOffset.y + 85;

      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      className="absolute mx-6 my-4 flex flex-col items-center cursor-default"
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onMouseDown={handleMouseDown}
      style={{
        right: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
      }}
    >
      <div
        className={
          isSelected && !isDragging
            ? "bg-gray-500 px-2 py-1 mb-1 rounded-[4px] bg-opacity-40 outline outline-gray-400 outline-2"
            : "px-2 py-1 mb-1"
        }
      >
        <Image
          src={iconImage}
          alt="icon"
          width={60}
          height={60}
          draggable={false}
        />
      </div>
      <div
        className={
          isSelected || isDragging
            ? "bg-blue-700 px-2 py-1 mt-1 rounded-[6px]"
            : "px-2 py-1 mt-1"
        }
      >
        <div className="text-[13px] font-semibold drop-shadow-md">
          {iconLabel}
        </div>
      </div>
    </div>
  );
};

export default DesktopIcon;
