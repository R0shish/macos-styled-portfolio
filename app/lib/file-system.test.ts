import { describe, expect, it } from "vitest";
import {
  buildFileEntries,
  getLocationTitle,
  isLocation,
  listLocation,
} from "./file-system";
import { createContent } from "../../test/fixtures";

const content = createContent();
const entries = buildFileEntries(content);
const fileState = (trashed: string[] = []) => ({
  trashed,
  isVisible: (id: string) => !trashed.includes(id),
});
const ids = (list: { id: string }[]) => list.map((entry) => entry.id);

describe("file system", () => {
  it("validates locations", () => {
    expect(isLocation("projects")).toBe(true);
    expect(isLocation("tag:Flutter")).toBe(true);
    expect(isLocation("nowhere")).toBe(false);
    expect(isLocation(undefined)).toBe(false);
  });

  it("titles the home folder with the username", () => {
    expect(getLocationTitle("home", "jane")).toBe("jane");
    expect(getLocationTitle("tag:Mobile", "jane")).toBe("Mobile");
  });

  it("lists projects and filters them by tag", () => {
    expect(ids(listLocation("projects", entries, "jane", fileState()))).toEqual(
      ["rocket", "secret"]
    );
    expect(
      ids(listLocation("tag:Golang", entries, "jane", fileState()))
    ).toEqual(["secret"]);
  });

  it("moves trashed files out of their folder and into the Trash", () => {
    const state = fileState(["rocket", "cv"]);
    expect(ids(listLocation("projects", entries, "jane", state))).toEqual([
      "secret",
    ]);
    expect(ids(listLocation("documents", entries, "jane", state))).toEqual([]);
    expect(ids(listLocation("trash", entries, "jane", state))).toEqual([
      "cv",
      "rocket",
    ]);
  });

  it("only opens projects that have a link", () => {
    const [rocket, secret] = entries.projects;
    expect(rocket.open).toEqual({
      type: "url",
      url: "https://example.com/rocket",
    });
    expect(secret.open).toEqual({ type: "none" });
  });

  it("protects applications and folders from rename and trash", () => {
    const [finder] = entries.applications;
    expect(finder.canTrash).toBe(false);
    expect(finder.canRename).toBe(false);
  });
});
