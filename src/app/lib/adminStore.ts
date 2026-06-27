import { useCallback, useSyncExternalStore } from "react";
import type { ImageAsset } from "@/app/types/media";

export type { ImageAsset } from "@/app/types/media";

export type AdminSkill = {
  id: string;
  name: string;
  category:
    | "frontend"
    | "backend"
    | "devops"
    | "design"
    | "database"
    | "mobile"
    | "ai"
    | "other";
  icon?: ImageAsset;
};

export type AdminTestimonial = {
  id: string;
  name: string;
  avatar?: ImageAsset;
  description: string;
  designation?: string;
  rating: number;
  testimonial_date: string;
};

export type AdminAchievement = {
  id: string;
  achievement_date: string;
  title: string;
  position:
    | "first"
    | "second"
    | "third"
    | "finalist"
    | "winner"
    | "runner-up"
    | "participant";
  description?: string;
  competition_name: string;
  images: ImageAsset[];
  certificate_url?: ImageAsset;
};

export type AdminExperience = {
  id: string;
  start_date: string;
  end_date: string | null;
  location?: string;
  designation: string;
  description?: string;
  responsibilities: string[];
  organization_name: string;
  organization_url?: string;
  organization_logo_url?: ImageAsset;
  tech_stack: string[];
};

export const genId = () => {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return Math.random().toString(36).slice(2, 10);
};

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; items: any[] }>();

function subscribeKey(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => set?.delete(listener);
}

function emitKey(key: string) {
  const set = listeners.get(key);
  if (!set) return;
  for (const listener of set) listener();
}

function readItems<T>(key: string, fallback: T[] = []): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) return cached.items as T[];

    if (!raw) {
      cache.set(key, { raw: null, items: fallback as any[] });
      return fallback;
    }

    const parsed = JSON.parse(raw) as unknown;
    const items =
      Array.isArray(parsed)
        ? (parsed as T[])
        : parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)
          ? ((parsed as any).items as T[])
          : fallback;

    cache.set(key, { raw, items: items as any[] });
    return items;
  } catch {
    cache.set(key, { raw: "__parse_error__", items: fallback as any[] });
    return fallback;
  }
}

function writeItems<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify({ items });
  cache.set(key, { raw, items: items as any[] });
  window.localStorage.setItem(key, raw);
  emitKey(key);
}

export function useAdminStore<T = any>(
  key: string,
  opts?: { initial?: T[]; getId?: (item: T) => string },
) {
  const getSnapshot = () => readItems<T>(key, opts?.initial ?? []);
  const getServerSnapshot = () => opts?.initial ?? [];

  const items = useSyncExternalStore(
    (listener) => subscribeKey(key, listener),
    getSnapshot,
    getServerSnapshot,
  );

  const setItems = useCallback((next: T[]) => writeItems(key, next), [key]);

  const add = useCallback((item: T) => setItems([...items, item]), [items, setItems]);

  const getId = useCallback(
    (it: T) => {
      const getter = opts?.getId;
      if (getter) return getter(it);
      const anyIt = it as any;
      if (typeof anyIt?.id === "string") return anyIt.id as string;
      throw new Error(`useAdminStore(${key}) requires opts.getId or an 'id' field`);
    },
    [key, opts?.getId],
  );

  const update = useCallback(
    (id: string, patch: Partial<T> | T) => {
      setItems(items.map((it) => (getId(it) === id ? { ...(it as any), ...(patch as any) } : it)));
    },
    [getId, items, setItems],
  );

  const remove = useCallback((id: string) => setItems(items.filter((it) => getId(it) !== id)), [getId, items, setItems]);

  const clear = useCallback(() => setItems([]), [setItems]);

  return { items, setItems, add, update, remove, clear };
}
