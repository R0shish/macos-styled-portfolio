"use client";

import React, { useEffect, useRef, useState } from "react";
import { AppProps } from "../../../lib/apps";
import { useContent } from "../../../context/content-context";
import {
  canGoBack,
  canGoForward,
  createHistory,
  currentEntry,
  pushHistory,
  stepHistory,
} from "../../../lib/history";
import { canEmbed, getHost, toUrl } from "../../../lib/browser";
import { PortfolioContent } from "../../../lib/content/schema";
import { useWindowFocus } from "../../window/window-focus";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";
import AddressBar from "./address-bar";
import StartPage, { START_PAGE } from "./start-page";
import BlockedPage from "./blocked-page";

const FALLBACK_HOMEPAGE = "https://en.wikipedia.org";

const getHomepage = ({ system, profile }: PortfolioContent) =>
  system.browser.homepage ?? profile.links.website ?? FALLBACK_HOMEPAGE;

const isEmbeddedInAnotherPage = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

const openInNewTab = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

const Safari: React.FC<AppProps> = ({ payload, openedAt }) => {
  const content = useContent();
  const homepage = getHomepage(content);
  const isFocused = useWindowFocus();

  const [history, setHistory] = useState(() =>
    createHistory(
      payload
        ? toUrl(payload)
        : isEmbeddedInAnotherPage()
          ? START_PAGE
          : homepage
    )
  );
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const addressRef = useRef<HTMLInputElement>(null);

  const url = currentEntry(history);
  const isStartPage = url === START_PAGE;
  const isEmbeddable = !isStartPage && canEmbed(url);

  const navigate = (input: string) => {
    const next = input === START_PAGE ? START_PAGE : toUrl(input);
    if (next) setHistory((current) => pushHistory(current, next));
  };

  useEffect(() => {
    if (payload) navigate(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, openedAt]);

  useEffect(() => {
    setIsLoading(isEmbeddable);
  }, [url, reloadKey, isEmbeddable]);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "l") {
        e.preventDefault();
        addressRef.current?.focus();
      }
      if (e.metaKey && e.key === "r") {
        e.preventDefault();
        setReloadKey((key) => key + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        leading={
          <ToolbarGroup>
            <ToolbarButton
              symbol="chevron-left"
              title="Back"
              disabled={!canGoBack(history)}
              onClick={() => setHistory((current) => stepHistory(current, -1))}
            />
            <div className="w-px h-4 bg-black/10 dark:bg-white/15" />
            <ToolbarButton
              symbol="chevron-right"
              title="Forward"
              disabled={!canGoForward(history)}
              onClick={() => setHistory((current) => stepHistory(current, 1))}
            />
          </ToolbarGroup>
        }
        trailing={
          <>
            <AddressBar
              ref={addressRef}
              url={isStartPage ? "" : url}
              isLoading={isLoading}
              onSubmit={navigate}
              onReload={() => setReloadKey((key) => key + 1)}
              onStop={() => setIsLoading(false)}
            />
            <ToolbarGroup className="px-0.5">
              <ToolbarButton
                symbol="arrow-up-forward-square"
                title="Open in New Tab"
                disabled={isStartPage}
                onClick={() => openInNewTab(url)}
              />
            </ToolbarGroup>
          </>
        }
      />

      <div className="relative flex-grow min-h-0">
        {isLoading && (
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[2px] z-10 overflow-hidden"
          >
            <div className="h-full w-1/3 bg-[#0a84ff] animate-[safari-progress_1.2s_ease-in-out_infinite]" />
          </div>
        )}

        {isStartPage ? (
          <StartPage homepage={homepage} onOpen={navigate} />
        ) : isEmbeddable ? (
          <iframe
            key={`${url}-${reloadKey}`}
            src={url}
            title={getHost(url)}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full bg-white"
          />
        ) : (
          <BlockedPage host={getHost(url)} onOpen={() => openInNewTab(url)} />
        )}
      </div>
    </div>
  );
};

export default Safari;
