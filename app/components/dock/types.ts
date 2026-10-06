import { IconSource } from "../../lib/icons";

export interface DockItem {
  key: string;
  title: string;
  icon: IconSource;
  onClick: () => void;
  isRunning?: boolean;
  isLaunching?: boolean;
  isMinimizedWindow?: boolean;
  onDropFile?: (fileId: string) => void;
}
