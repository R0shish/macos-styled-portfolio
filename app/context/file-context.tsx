"use client";

import React, { createContext, useContext, useState } from "react";

interface FileContextValue {
  trashed: string[];
  deleted: string[];
  names: Record<string, string>;
  moveToTrash: (ids: string[]) => void;
  putBack: (ids: string[]) => void;
  emptyTrash: () => void;
  rename: (id: string, name: string) => void;
  getName: (id: string, fallback: string) => string;
  isVisible: (id: string) => boolean;
}

const FileContext = createContext<FileContextValue | null>(null);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trashed, setTrashed] = useState<string[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  const moveToTrash = (ids: string[]) => {
    setTrashed((prev) => [...prev.filter((id) => !ids.includes(id)), ...ids]);
  };

  const putBack = (ids: string[]) => {
    setTrashed((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const emptyTrash = () => {
    setDeleted((prev) => [...prev, ...trashed]);
    setTrashed([]);
  };

  const rename = (id: string, name: string) => {
    if (name.trim()) setNames((prev) => ({ ...prev, [id]: name.trim() }));
  };

  const getName = (id: string, fallback: string) => names[id] ?? fallback;

  const isVisible = (id: string) =>
    !trashed.includes(id) && !deleted.includes(id);

  return (
    <FileContext.Provider
      value={{
        trashed,
        deleted,
        names,
        moveToTrash,
        putBack,
        emptyTrash,
        rename,
        getName,
        isVisible,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFiles must be used inside FileProvider");
  return context;
};

export const FILE_DRAG_TYPE = "application/x-portfolio-file";
