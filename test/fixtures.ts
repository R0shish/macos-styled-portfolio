import { PortfolioContent, parsePortfolio } from "../app/lib/content/schema";

export const createContent = (
  overrides: Partial<PortfolioContent> = {}
): PortfolioContent =>
  parsePortfolio({
    site: { title: "Jane", description: "Portfolio" },
    profile: {
      name: "Jane Appleseed",
      initials: "JA",
      username: "jane",
      role: "Engineer",
      summary: "Builds things.",
      careerStart: "2020-01",
      email: "jane@example.com",
      cv: "/cv.pdf",
      links: { github: "https://github.com/jane" },
    },
    experiences: [
      {
        id: "acme",
        company: "Acme",
        role: "Engineer",
        start: "2021-03",
        description: "Did work.",
      },
    ],
    projects: [
      {
        id: "rocket",
        name: "Rocket",
        company: "Acme",
        description: "Goes up.",
        tags: ["Flutter", "Mobile"],
        link: "https://example.com/rocket",
      },
      {
        id: "secret",
        name: "Secret",
        company: "Acme",
        description: "Private.",
        tags: ["Golang"],
      },
    ],
    system: {
      defaultWallpaper: "plain",
      wallpapers: [{ id: "plain", name: "Plain", gradient: "#000" }],
      welcome: { title: "Hi", body: "Welcome" },
    },
    ...overrides,
  });
