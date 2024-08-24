import React from "react";
import DateTimeDisplay from "./date-time-display";
import Image from "next/image";

const menuItems: string[] = ["File", "Edit", "View", "Go", "Window", "Help"];

interface MenuItemProps {
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ label }) => (
  <div className="cursor-default px-1 py-1 rounded">{label}</div>
);
const Menubar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center bg-blue-100 text-sm text-black">
      <div className="flex space-x-4 items-center">
        <Image
          className="ml-6 mr-1"
          src="/icons/apple.png"
          alt="apple"
          width={13}
          height={13}
        />
        <div className="font-bold cursor-default">Finder</div>
        {menuItems.map((item) => (
          <MenuItem key={item} label={item} />
        ))}
      </div>
      <div className="flex space-x-2 items-center mr-5">
        <div className="flex">
          <Image
            className="mx-2"
            src="/icons/search.svg"
            alt="control center"
            width={16}
            height={16}
          />
          <Image
            className="mx-2"
            src="/icons/control-center.svg"
            alt="control center"
            width={16}
            height={16}
          />
        </div>
        <DateTimeDisplay />
      </div>
    </nav>
  );
};

export default Menubar;
