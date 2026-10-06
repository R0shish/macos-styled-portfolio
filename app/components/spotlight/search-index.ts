import { apps } from "../../lib/apps";
import { IconSource, icons } from "../../lib/icons";
import { PortfolioContent } from "../../lib/content/schema";
import { OpenTarget } from "../../lib/file-system";

import FolderIcon from "../../assets/icons/files/folder.png";
import PdfIcon from "../../assets/icons/files/pdf.png";
import SafariIcon from "../../assets/icons/apps/safari.png";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: IconSource;
  target: OpenTarget;
}

export const buildSearchIndex = ({
  profile,
  projects,
  experiences,
}: PortfolioContent): SearchResult[] => [
  ...apps.map<SearchResult>((app) => ({
    id: `app-${app.id}`,
    title: app.name,
    subtitle: "Application",
    category: "Applications",
    icon: app.icon,
    target: { type: "app", app: app.id },
  })),
  {
    id: "cv",
    title: "CV.pdf",
    subtitle: "Documents",
    category: "Documents",
    icon: PdfIcon,
    target: { type: "app", app: "preview" },
  },
  ...projects.map<SearchResult>((project) => ({
    id: `project-${project.id}`,
    title: project.name,
    subtitle: [project.company, project.tags.join(", ")]
      .filter(Boolean)
      .join(" · "),
    category: "Projects",
    icon: FolderIcon,
    target: { type: "app", app: "finder", payload: `projects/${project.id}` },
  })),
  ...experiences.map<SearchResult>((experience) => ({
    id: `experience-${experience.id}`,
    title: experience.company,
    subtitle: experience.role,
    category: "Experience",
    icon: icons.notes,
    target: { type: "app", app: "notes", payload: experience.id },
  })),
  ...(
    [
      ["github", "GitHub", profile.links.github],
      ["linkedin", "LinkedIn", profile.links.linkedin],
      ["website", "Website", profile.links.website],
    ] as const
  ).flatMap(([id, title, url]) =>
    url
      ? [
          {
            id,
            title,
            subtitle: url,
            category: "Links",
            icon: SafariIcon,
            target: { type: "url" as const, url },
          },
        ]
      : []
  ),
];

export const searchIndex = (index: SearchResult[], query: string) => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return index.filter((result) => {
    const haystack = `${result.title} ${result.subtitle}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
};
