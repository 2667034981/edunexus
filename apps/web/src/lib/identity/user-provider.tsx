"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ensureLocalUser,
  updateLocalUserDisplayName,
  type LocalUser,
} from "./local-user";

type LocalUserContextValue = {
  user: LocalUser | null;
  userId: string;
  displayName: string;
  ready: boolean;
  setDisplayName: (name: string) => void;
  refresh: () => void;
};

const LocalUserContext = createContext<LocalUserContextValue | null>(null);

export function LocalUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const next = ensureLocalUser();
    setUser(next);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setDisplayName = useCallback((name: string) => {
    const next = updateLocalUserDisplayName(name);
    setUser(next);
  }, []);

  const value = useMemo<LocalUserContextValue>(
    () => ({
      user,
      userId: user?.userId ?? "",
      displayName: user?.displayName ?? "本地学习者",
      ready,
      setDisplayName,
      refresh,
    }),
    [user, ready, setDisplayName, refresh]
  );

  return (
    <LocalUserContext.Provider value={value}>{children}</LocalUserContext.Provider>
  );
}

export function useLocalUser(): LocalUserContextValue {
  const ctx = useContext(LocalUserContext);
  if (!ctx) {
    throw new Error("useLocalUser 必须在 LocalUserProvider 内使用");
  }
  return ctx;
}

/** 可选读取，避免在 Provider 外崩溃（如工具脚本） */
export function useLocalUserOptional(): LocalUserContextValue | null {
  return useContext(LocalUserContext);
}
