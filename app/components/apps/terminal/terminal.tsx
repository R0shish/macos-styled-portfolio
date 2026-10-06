"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWindows } from "../../../context/window-context";
import { useContent } from "../../../context/content-context";
import { completions, runCommand } from "./commands";
import { Toolbar } from "../../window/toolbar";

interface Entry {
  id: number;
  input: string;
  output: React.ReactNode;
}

const Prompt: React.FC = () => {
  const { profile, system } = useContent();

  return (
    <span className="shrink-0 mr-2">
      <span className="text-green-400">
        {profile.username}@{system.hostname}
      </span>{" "}
      <span className="text-blue-400">~</span> %
    </span>
  );
};

const Terminal: React.FC = () => {
  const { openApp, closeApp } = useWindows();
  const content = useContent();
  const { profile } = content;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [lastLogin] = useState(() =>
    new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const submit = () => {
    const nextHistory = input.trim() ? [...history, input.trim()] : history;
    let cleared = false;

    const output = runCommand(input, {
      openApp,
      closeTerminal: () => closeApp("terminal"),
      clear: () => (cleared = true),
      history: nextHistory,
      content,
    });

    setHistory(nextHistory);
    setHistoryIndex(null);
    setInput("");
    setEntries(
      cleared ? [] : [...entries, { id: nextId.current++, input, output }]
    );
  };

  const browseHistory = (direction: -1 | 1) => {
    if (!history.length) return;
    const current = historyIndex ?? history.length;
    const next = Math.min(Math.max(current + direction, 0), history.length);
    setHistoryIndex(next === history.length ? null : next);
    setInput(history[next] ?? "");
  };

  const autocomplete = () => {
    if (!input) return;
    const matches = completions.filter((c) => c.startsWith(input));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      setEntries([
        ...entries,
        {
          id: nextId.current++,
          input,
          output: matches.join("    "),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        submit();
        break;
      case "ArrowUp":
        e.preventDefault();
        browseHistory(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        browseHistory(1);
        break;
      case "Tab":
        e.preventDefault();
        autocomplete();
        break;
      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          setEntries([]);
        }
        break;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]/95 text-[#f2f2f2]">
      <Toolbar
        hasControls
        centerTitle
        title={
          <span className="text-13 font-semibold text-white/70">
            {profile.username} — -zsh — 80×24
          </span>
        }
        className="h-[52px] border-b border-black/60"
      />
      <div
        className="selectable flex-grow overflow-y-auto font-mono text-12 leading-relaxed p-2 cursor-text"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div>Last login: {lastLogin} on ttys000</div>
        <div className="text-neutral-400 mb-1">
          Type `help` to see what you can do here.
        </div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex">
              <Prompt />
              <span className="break-all">{entry.input}</span>
            </div>
            {entry.output && (
              <div className="whitespace-pre-wrap break-words">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex" ref={bottomRef}>
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent outline-none caret-neutral-200"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
