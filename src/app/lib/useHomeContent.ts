import { useCallback, useEffect, useState } from "react";

import { PORTFOLIO_USER_ID } from "@/app/config";
import type { HomeContent } from "@/app/types/homeContent";
import { fetchUserHomeContent } from "@/services/user";

let homeContentRequest: Promise<HomeContent> | null = null;

function getHomeContentOnce() {
  if (!homeContentRequest) {
    homeContentRequest = fetchUserHomeContent(PORTFOLIO_USER_ID).catch((error) => {
      homeContentRequest = null;
      throw error;
    });
  }

  return homeContentRequest;
}

export function useHomeContent() {
  const [items, setItems] = useState<HomeContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadHomeContent() {
      setIsLoading(true);
      setError(null);

      try {
        const content = await getHomeContentOnce();
        if (isActive) {
          setItems([content]);
        }
      } catch (requestError) {
        if (isActive) {
          setItems([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load portfolio content.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    }

    void loadHomeContent();

    return () => {
      isActive = false;
    };
  }, []);

  const replaceItems = useCallback((next: HomeContent[]) => {
    setItems(next);
  }, []);

  return { items, setItems: replaceItems, isLoading, error, hasLoaded };
}
