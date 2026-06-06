import type { RichProject } from "@/app/data/richProjectData";
import { richProjects } from "@/app/data/appData";
import { useAdminStore } from "@/app/lib/adminStore";

export function useProjects() {
  return useAdminStore<RichProject>("admin:projects", {
    initial: richProjects,
    seed: true,
    getId: (p) => p.slug,
  });
}

