import { API_BASE_URL } from "@/app/config";
import type {
  Experience,
  ExperienceApiImage,
  ExperienceApiItem,
  ExperienceLogo,
  ExperienceResponse,
} from "./type";

const toExperienceLogo = (
  image: ExperienceApiItem["organization_logo_url"],
  fallbackAlt: string,
): ExperienceLogo | undefined => {
  if (!image) return undefined;

  if (typeof image === "string") {
    return image.trim() ? { url: image, alt: fallbackAlt } : undefined;
  }

  const logo = image as ExperienceApiImage;
  const url = (logo.secureUrl || logo.secure_url || logo.url || logo.src)?.trim();
  if (!url) return undefined;

  const filename = logo.originalFilename || logo.original_filename;

  return {
    url,
    alt: logo.alt || filename || fallbackAlt,
    width: logo.width,
    height: logo.height,
  };
};

const normalizeExperience = (experience: ExperienceApiItem): Experience => ({
  _id: experience._id,
  user_id: experience.user_id,
  start_date: experience.start_date,
  end_date: experience.end_date,
  location: experience.location,
  designation: experience.designation,
  description: experience.description,
  responsibilities: experience.responsibilities,
  organization_name: experience.organization_name,
  organization_logo_url: toExperienceLogo(
    experience.organization_logo_url,
    `${experience.organization_name} logo`,
  ),
  organization_url: experience.organization_url,
  tech_stack: experience.tech_stack,
  createdAt: experience.createdAt,
  updatedAt: experience.updatedAt,
});

export async function fetchExperiences(userId: string): Promise<Experience[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch experience.");
  }

  const response = await fetch(
    `${API_BASE_URL}/experience/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch experience. Status: ${response.status}`);
  }

  const json = (await response.json()) as ExperienceResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Experience response was not successful.");
  }

  return json.data.map(normalizeExperience);
}

export type { Experience };
