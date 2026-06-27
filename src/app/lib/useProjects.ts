import { useCallback, useEffect, useState } from "react";

import { PORTFOLIO_USER_ID } from "@/app/config";
import type { RichProject } from "@/app/data/richProjectData";
import { fetchProjects } from "@/services/project";

export function useProjects() {
  const [items, setItems] = useState<RichProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      setIsLoading(true);
      setError(null);

      try {
        const projects = await fetchProjects(PORTFOLIO_USER_ID);
        if (isActive) {
          setItems(projects);
        }
      } catch (requestError) {
        if (isActive) {
          setItems([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load projects.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    }

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  const replaceItems = useCallback((next: RichProject[]) => {
    setItems(next);
  }, []);

  return { items, setItems: replaceItems, isLoading, error, hasLoaded };
}
