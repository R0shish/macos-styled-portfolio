"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NOTIFICATION_DURATION_MS } from "../lib/constants";

export interface Notification {
  id: number;
  title: string;
  body: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (title: string, body: string) => void;
  dismiss: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo<NotificationContextValue>(() => {
    const dismiss = (id: number) => {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const notify = (title: string, body: string) => {
      const id = nextId.current++;
      setNotifications((prev) => [...prev, { id, title, body }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), NOTIFICATION_DURATION_MS)
      );
    };

    return { notifications, notify, dismiss };
  }, [notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  return context;
};
