import { createContext, useContext, useMemo } from "react";

import type { BlogPost } from "@/app/types/blog";
import { blogPosts as seedBlogPosts } from "@/app/data/appData";
import { useAdminStore } from "@/app/lib/adminStore";

type SetStateAction<T> = T | ((prev: T) => T);

type PortfolioContextValue = {
  blogPosts: BlogPost[];
  setBlogPosts: (action: SetStateAction<BlogPost[]>) => void;
  isAdmin: boolean;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { items: blogPosts, setItems } = useAdminStore<BlogPost>("portfolio:blogPosts", {
    initial: seedBlogPosts,
    seed: true,
    getId: (b) => b.id,
  });

  const value = useMemo<PortfolioContextValue>(() => {
    return {
      blogPosts,
      setBlogPosts: (action) => {
        const next = typeof action === "function" ? (action as (prev: BlogPost[]) => BlogPost[])(blogPosts) : action;
        setItems(next);
      },
      isAdmin: true,
    };
  }, [blogPosts, setItems]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within <PortfolioProvider>");
  return ctx;
}
