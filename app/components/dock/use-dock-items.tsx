import { AppId, getApp } from "../../lib/apps";
import { icons } from "../../lib/icons";
import { useContent } from "../../context/content-context";
import { useFiles } from "../../context/file-context";
import { useOverlays } from "../../context/overlay-context";
import { useWindows } from "../../context/window-context";
import { DockItem } from "./types";

import VSCodeIcon from "../../assets/icons/apps/vscode.png";
import TrashIcon from "../../assets/icons/files/trash.png";
import TrashFullIcon from "../../assets/icons/files/trash-full.png";

const PINNED_APPS: AppId[] = [
  "finder",
  "about",
  "notes",
  "terminal",
  "mail",
  "settings",
];

export function useDockItems(): DockItem[][] {
  const { windows, launching, openApp, focusApp } = useWindows();
  const { isLauncherOpen, setLauncherOpen } = useOverlays();
  const { trashed, moveToTrash } = useFiles();
  const { repository } = useContent().profile.links;

  const appItem = (id: AppId): DockItem => ({
    key: id,
    title: getApp(id).name,
    icon: getApp(id).icon,
    onClick: () => {
      setLauncherOpen(false);
      openApp(id);
    },
    isRunning: id === "finder" || windows.some((w) => w.id === id),
    isLaunching: launching === id,
  });

  const [finder, ...pinned] = PINNED_APPS.map(appItem);
  const settings = pinned.pop()!;

  const launcher: DockItem = {
    key: "apps",
    title: "Apps",
    icon: icons.apps,
    onClick: () => setLauncherOpen(!isLauncherOpen),
  };

  const sourceCode: DockItem[] = repository
    ? [
        {
          key: "source",
          title: "Visual Studio Code",
          icon: VSCodeIcon,
          onClick: () =>
            window.open(
              repository.replace("github.com", "github.dev"),
              "_blank",
              "noopener,noreferrer"
            ),
        },
      ]
    : [];

  const running = windows
    .filter((w) => !PINNED_APPS.includes(w.id))
    .map((w) => appItem(w.id));

  const minimized = windows
    .filter((w) => w.isMinimized)
    .map<DockItem>((w) => ({
      key: `minimized-${w.id}`,
      title: getApp(w.id).title,
      icon: getApp(w.id).icon,
      isMinimizedWindow: true,
      onClick: () => focusApp(w.id),
    }));

  const trash: DockItem = {
    key: "trash",
    title: "Trash",
    icon: trashed.length ? TrashFullIcon : TrashIcon,
    onClick: () => openApp("finder", "trash"),
    onDropFile: (fileId) => moveToTrash([fileId]),
  };

  return [
    [finder, launcher, ...pinned, ...sourceCode, settings],
    running,
    [...minimized, trash],
  ].filter((group) => group.length);
}
