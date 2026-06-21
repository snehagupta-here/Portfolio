import { useEffect } from "react";

import { PORTFOLIO_USER_ID } from "@/app/config";
import type { RichProject } from "@/app/data/richProjectData";
import { richProjects } from "@/app/data/appData";
import { useAdminStore } from "@/app/lib/adminStore";
import { fetchProjects } from "@/services/project";

export function useProjects() {
  const store = useAdminStore<RichProject>("admin:projects", {
    initial: richProjects,
    seed: true,
    getId: (p) => p.slug,
  });

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      try {
        const projects = await fetchProjects(PORTFOLIO_USER_ID);
        if (isActive) {
          store.setItems(projects);
        }
      } catch {
        // Keep seeded projects available if the API request fails.
      }
    }

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, [store.setItems]);

  return store;
}
