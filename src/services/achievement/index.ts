import type {
  Achievement,
  AchievementApiImage,
  AchievementApiItem,
  AchievementImage,
  AchievementResponse,
} from "./type";
import { API_BASE_URL } from "@/app/config";

const toAchievementImage = (
  image: AchievementApiImage,
  fallbackAlt: string,
): AchievementImage | null => {
  if (typeof image === "string") {
    return image ? { url: image, alt: fallbackAlt } : null;
  }

  const url = (image.secureUrl || image.secure_url || image.url || image.src)?.trim();
  if (!url) return null;

  const filename = image.originalFilename || image.original_filename;

  return {
    url,
    alt: image.alt || filename || fallbackAlt,
    caption: image.caption || filename,
  };
};

const toCertificateUrl = (
  certificateUrl: AchievementApiItem["certificate_url"],
): string | undefined => {
  if (!certificateUrl) return undefined;
  if (typeof certificateUrl === "string") return certificateUrl;
  return (
    certificateUrl.secureUrl ||
    certificateUrl.secure_url ||
    certificateUrl.url ||
    certificateUrl.src
  );
};

const normalizeAchievement = (achievement: AchievementApiItem): Achievement => {
  const fallbackAlt = `${achievement.title} achievement image`;
  const images = achievement.images?.length > 0 ? achievement.images : [];

  return {
    _id: achievement._id,
    user_id: achievement.user_id,
    achievement_date: achievement.achievement_date,
    title: achievement.title,
    position: achievement.position,
    description: achievement.description,
    competition_name: achievement.competition_name,
    images: images
      .map((image) => toAchievementImage(image, fallbackAlt))
      .filter((image): image is AchievementImage => Boolean(image)),
    certificate_url: toCertificateUrl(achievement.certificate_url),
    createdAt: achievement.createdAt,
    updatedAt: achievement.updatedAt,
  };
};

export async function fetchAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch achievements.");
  }

  const response = await fetch(
    `${API_BASE_URL}/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch achievements. Status: ${response.status}`);
  }

  const json = (await response.json()) as AchievementResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Achievement response was not successful.");
  }

  return json.data.map(normalizeAchievement);
}

export const getPositionColor = (position: string): string => {
  const value = position.toLowerCase();

  if (value.includes("1st") || value.includes("first")) {
    return "from-primary to-accent";
  }

  if (value.includes("2nd") || value.includes("second") || value.includes("runner")) {
    return "from-amber to-rose-gold";
  }

  if (value.includes("3rd") || value.includes("third")) {
    return "from-rose-gold to-amber";
  }

  if (value.includes("winner")) {
    return "from-emerald to-blue-glow";
  }

  if (value.includes("finalist")) {
    return "from-purple-glow to-blue-glow";
  }

  return "from-primary to-accent";
};

export type { Achievement };
