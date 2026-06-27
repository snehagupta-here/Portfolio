import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { BlogPost } from "@/app/types/blog";
import { PORTFOLIO_USER_ID } from "@/app/config";
import { fetchBlogPosts } from "@/services/blog";

type SetStateAction<T> = T | ((prev: T) => T);

type PortfolioContextValue = {
  blogPosts: BlogPost[];
  setBlogPosts: (action: SetStateAction<BlogPost[]>) => void;
  blogError: string | null;
  isBlogLoading: boolean;
  isAdmin: boolean;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [blogPosts, setItems] = useState<BlogPost[]>([]);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [isBlogLoading, setIsBlogLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadBlogPosts() {
      setIsBlogLoading(true);
      setBlogError(null);

      try {
        const data = await fetchBlogPosts(PORTFOLIO_USER_ID);
        if (!ignore) {
          setItems(data);
        }
      } catch (error) {
        if (!ignore) {
          setBlogError(error instanceof Error ? error.message : "Unable to load blog posts.");
        }
      } finally {
        if (!ignore) {
          setIsBlogLoading(false);
        }
      }
    }

    void loadBlogPosts();

    return () => {
      ignore = true;
    };
  }, [setItems]);

  const value = useMemo<PortfolioContextValue>(() => {
    return {
      blogPosts,
      setBlogPosts: (action) => {
        const next = typeof action === "function" ? (action as (prev: BlogPost[]) => BlogPost[])(blogPosts) : action;
        setItems(next);
      },
      blogError,
      isBlogLoading,
      isAdmin: true,
    };
  }, [blogError, blogPosts, isBlogLoading, setItems]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within <PortfolioProvider>");
  return ctx;
}
