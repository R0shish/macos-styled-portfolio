export interface History<T> {
  entries: T[];
  index: number;
}

export const createHistory = <T>(initial: T): History<T> => ({
  entries: [initial],
  index: 0,
});

export const pushHistory = <T>(history: History<T>, next: T): History<T> =>
  history.entries[history.index] === next
    ? history
    : {
        entries: [...history.entries.slice(0, history.index + 1), next],
        index: history.index + 1,
      };

export const stepHistory = <T>(
  history: History<T>,
  step: -1 | 1
): History<T> => ({
  ...history,
  index: Math.min(
    Math.max(history.index + step, 0),
    history.entries.length - 1
  ),
});

export type FinderView = "grid" | "list";

const ARROW_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

export const isArrowKey = (key: string) => ARROW_KEYS.includes(key);

export const getNextSelectionIndex = (
  key: string,
  currentIndex: number,
  itemCount: number,
  columns: number,
  view: FinderView
): number | null => {
  if (!itemCount || !isArrowKey(key)) return null;
  if (currentIndex === -1) return 0;

  const rowStep = view === "grid" ? columns : 1;
  const step = {
    ArrowRight: view === "grid" ? 1 : 0,
    ArrowLeft: view === "grid" ? -1 : 0,
    ArrowDown: rowStep,
    ArrowUp: -rowStep,
  }[key]!;

  return Math.min(Math.max(currentIndex + step, 0), itemCount - 1);
};

export const countGridColumns = (grid: HTMLElement | null) => {
  const cells = Array.from(grid?.children ?? []) as HTMLElement[];
  if (!cells.length) return 1;
  return cells.filter((cell) => cell.offsetTop === cells[0].offsetTop).length;
};
