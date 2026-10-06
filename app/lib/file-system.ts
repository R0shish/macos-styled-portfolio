import { StaticImageData } from "next/image";
import type { AppId } from "./apps";
import { apps } from "./apps";
import { IconSource, icons } from "./icons";
import { PortfolioContent } from "./content/schema";

import FolderIcon from "../assets/icons/files/folder.png";
import ApplicationsFolderIcon from "../assets/icons/files/folder-applications.png";
import DesktopFolderIcon from "../assets/icons/files/folder-desktop.png";
import DocumentsFolderIcon from "../assets/icons/files/folder-documents.png";
import DownloadsFolderIcon from "../assets/icons/files/folder-downloads.png";
import PdfIcon from "../assets/icons/files/pdf.png";

export type OpenTarget =
  | { type: "app"; app: AppId; payload?: string }
  | { type: "url"; url: string }
  | { type: "folder"; location: Location }
  | { type: "none" };

export interface FileEntry {
  id: string;
  name: string;
  kind: string;
  icon: IconSource;
  canTrash: boolean;
  canRename: boolean;
  open: OpenTarget;
  preview?: string;
  info?: {
    subtitle: string;
    description: string;
    tags: string[];
    link?: string;
  };
}

export const folderIds = [
  "home",
  "recents",
  "applications",
  "desktop",
  "documents",
  "downloads",
  "projects",
  "trash",
] as const;

export type FolderId = (typeof folderIds)[number];
export type Location = FolderId | `tag:${string}`;

const folderIcons: Record<FolderId, StaticImageData> = {
  home: FolderIcon,
  recents: FolderIcon,
  applications: ApplicationsFolderIcon,
  desktop: DesktopFolderIcon,
  documents: DocumentsFolderIcon,
  downloads: DownloadsFolderIcon,
  projects: FolderIcon,
  trash: FolderIcon,
};

export const isLocation = (value?: string): value is Location =>
  !!value &&
  (folderIds.includes(value as FolderId) || value.startsWith("tag:"));

export const getTagFromLocation = (location: Location) =>
  location.startsWith("tag:") ? location.slice(4) : null;

export const getFolderName = (id: FolderId, username: string) =>
  id === "home" ? username : id[0].toUpperCase() + id.slice(1);

export const getLocationTitle = (location: Location, username: string) =>
  getTagFromLocation(location) ?? getFolderName(location as FolderId, username);

export const getProjectTags = (content: PortfolioContent) =>
  Array.from(new Set(content.projects.flatMap((project) => project.tags)));

export const folderEntry = (id: FolderId, username: string): FileEntry => ({
  id,
  name: getFolderName(id, username),
  kind: "Folder",
  icon: folderIcons[id],
  canTrash: false,
  canRename: false,
  open: { type: "folder", location: id },
});

export const buildFileEntries = ({ profile, projects }: PortfolioContent) => {
  const cv: FileEntry = {
    id: "cv",
    name: "CV.pdf",
    kind: "PDF Document",
    icon: PdfIcon,
    canTrash: true,
    canRename: true,
    preview: profile.cv,
    open: { type: "app", app: "preview" },
    info: {
      subtitle: "PDF Document",
      description: `Curriculum vitae of ${profile.name}.`,
      tags: [],
    },
  };

  const about: FileEntry = {
    id: "about",
    name: "About Me",
    kind: "Contact",
    icon: icons.contacts,
    canTrash: true,
    canRename: true,
    open: { type: "app", app: "about" },
    info: { subtitle: "Contact", description: profile.summary, tags: [] },
  };

  const projectEntries = projects.map<FileEntry>((project) => ({
    id: project.id,
    name: project.name,
    kind: "Folder",
    icon: FolderIcon,
    canTrash: true,
    canRename: true,
    open: project.link ? { type: "url", url: project.link } : { type: "none" },
    info: {
      subtitle: project.company,
      description: project.description,
      tags: project.tags,
      link: project.link,
    },
  }));

  const applications = apps.map<FileEntry>((app) => ({
    id: app.id,
    name: app.name,
    kind: "Application",
    icon: app.icon,
    canTrash: false,
    canRename: false,
    open: { type: "app", app: app.id },
  }));

  return { cv, about, projects: projectEntries, applications };
};

export type FileEntries = ReturnType<typeof buildFileEntries>;

interface FileState {
  trashed: string[];
  isVisible: (id: string) => boolean;
}

export const listLocation = (
  location: Location,
  entries: FileEntries,
  username: string,
  { trashed, isVisible }: FileState
): FileEntry[] => {
  const visible = (list: FileEntry[]) => list.filter((e) => isVisible(e.id));
  const tag = getTagFromLocation(location);
  if (tag)
    return visible(entries.projects.filter((e) => e.info?.tags.includes(tag)));

  switch (location as FolderId) {
    case "home":
      return (
        [
          "applications",
          "desktop",
          "documents",
          "downloads",
          "projects",
        ] as const
      ).map((id) => folderEntry(id, username));
    case "recents":
      return visible([entries.cv, ...entries.projects.slice(0, 4)]);
    case "applications":
      return entries.applications;
    case "desktop":
      return visible([
        entries.about,
        folderEntry("projects", username),
        entries.cv,
      ]);
    case "documents":
    case "downloads":
      return visible([entries.cv]);
    case "projects":
      return visible(entries.projects);
    case "trash":
      return [entries.cv, entries.about, ...entries.projects].filter((e) =>
        trashed.includes(e.id)
      );
  }
};

export const canOpen = (entry: FileEntry) => entry.open.type !== "none";
