"use client";
import React, { useState, useEffect, useRef } from "react";
import DesktopIcon from "./desktop-icon";

const Desktop = () => {
  const [icons, setIcons] = useState([
    {
      id: 0,
      label: "About Me",
      image: "/images/test.png",
      redirect: () => {
        window.open("/about");
      },
    },
    {
      id: 1,
      label: "CV",
      image: "/images/test.png",
      redirect: () => {
        window.open("/cv");
      },
    },
    {
      id: 2,
      label: "LinkedIn",
      image: "/images/linkedin.png",
      redirect: () => {
        window.open("https://www.linkedin.com/in/r0shish");
      },
    },
  ]);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) {
      setSelectedIcon(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={desktopRef} className="relative">
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          iconImage={icon.image}
          iconLabel={icon.label}
          initialPosition={{ x: 0, y: 140 * icon.id }}
          isSelected={selectedIcon === icon.id}
          onSelect={() => {
            setIcons((prevIcons) => [
              ...prevIcons.filter((i) => i.id !== icon.id),
              icon,
            ]);
            setSelectedIcon(icon.id);
          }}
          onDoubleClick={icon.redirect}
        />
      ))}
    </div>
  );
};

export default Desktop;
