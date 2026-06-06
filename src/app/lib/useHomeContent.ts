import { useAdminStore } from "@/app/lib/adminStore";
import { homeContent as seedHomeContent } from "@/app/data/appData";
import type { HomeContent } from "@/app/types/homeContent";

export function useHomeContent() {
  return useAdminStore<HomeContent>("admin:homeContent", {
    initial: seedHomeContent,
    seed: true,
    getId: (c) => c.id,
  });
}

