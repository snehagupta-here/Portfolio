import { useEffect } from "react";

import { PORTFOLIO_USER_ID } from "@/app/config";
import { useAdminStore } from "@/app/lib/adminStore";
import { homeContent as seedHomeContent } from "@/app/data/appData";
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
  const store = useAdminStore<HomeContent>("admin:homeContent", {
    initial: seedHomeContent,
    seed: true,
    getId: (c) => c.id,
  });

  useEffect(() => {
    let isActive = true;

    async function loadHomeContent() {
      try {
        const content = await getHomeContentOnce();
        if (isActive) {
          store.setItems([content]);
        }
      } catch {
        // Keep the existing seeded content if the API is unavailable.
      }
    }

    void loadHomeContent();

    return () => {
      isActive = false;
    };
  }, [store.setItems]);

  return store;
}
