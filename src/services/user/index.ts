import { API_BASE_URL } from "@/app/config";
import type { HomeSkill, HomeSkillCategory } from "@/app/types/home";
import type { HomeContent } from "@/app/types/homeContent";
import type {
  GitHubContributions,
  GitHubContributionsResponse,
  UserAsset,
  UserProfile,
  UserResponse,
  UserSkill,
} from "./type";

const getAssetUrl = (asset: UserAsset | undefined) =>
  (asset?.secureUrl || asset?.url || "").trim();

const getResumeFileName = (asset: UserAsset | undefined) => {
  const name = asset?.fileName || asset?.originalFilename;
  if (!name) return "resume.pdf";
  return name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
};

const skillCategoryMap: Record<string, HomeSkillCategory> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  design: "Design",
  mobile: "Mobile",
  devops: "DevOps",
  cloud: "Cloud",
  language: "Languages",
  languages: "Languages",
  other: "Other",
};

const toSkillCategory = (category: string | undefined): HomeSkillCategory => {
  if (!category) return "Other";
  const key = category.trim().toLowerCase();
  return skillCategoryMap[key] || "Other";
};

const toHomeSkill = (skill: UserSkill): HomeSkill | undefined => {
  const definition = skill.skill_id;
  const name = definition?.name?.trim();

  if (!definition?._id || !name) return undefined;

  return {
    id: definition._id,
    name,
    category: toSkillCategory(definition.category),
    iconUrl: getAssetUrl(definition.icon),
    iconAlt: definition.icon?.originalFilename || name,
    yearsOfExperience: skill.yoe,
    scale: skill.scale,
  };
};

const toHomeContent = (user: UserProfile): HomeContent => {
  const avatarUrl = getAssetUrl(user.avatar);
  const aboutImageUrl = getAssetUrl(user.aboutImage);
  const resumeUrl = getAssetUrl(user.resume);
  const paragraphs = user.paragraphs.length > 0
    ? user.paragraphs
    : [user.aboutBio, user.bio].filter((text): text is string => Boolean(text?.trim()));

  return {
    id: user._id,
    personalInfo: {
      name: user.name,
      title: user.title || "",
      tagline: user.tagline || "",
      bio: user.bio || user.aboutBio || paragraphs[0] || "",
      email: user.email,
      avatar: avatarUrl,
      aboutImage: aboutImageUrl,
    },
    about: {
      picture: {
        src: avatarUrl,
        alt: user.avatar?.originalFilename || user.name,
      },
      heading: user.aboutHeading || "About Me",
      paragraphs: paragraphs.map((text, index) => ({
        key: `about_p${index + 1}`,
        text,
      })),
      location: user.location || "",
      totalYearsExperience: user.totalYearsExperience || "",
      projectsCompleted: user.projectsCompleted || "",
      resumeUrl,
      resumeFileName: getResumeFileName(user.resume),
      highlights: user.highlights,
    },
    socialLinks: user.socialLinks,
    skills: (user.skills || [])
      .map(toHomeSkill)
      .filter((skill): skill is HomeSkill => Boolean(skill)),
  };
};

export async function fetchUserHomeContent(userId: string): Promise<HomeContent> {
  if (!userId) {
    throw new Error("User ID is required to fetch user profile.");
  }

  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
  }

  const json = (await response.json()) as UserResponse;

  if (!json.success || !json.data) {
    throw new Error(json.message || "User profile response was not successful.");
  }

  return toHomeContent(json.data);
}

const getFileNameFromDisposition = (disposition: string | null) => {
  if (!disposition) return undefined;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/"/g, ""));

  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1];
};

export async function downloadResume(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to download resume.");
  }

  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(userId)}/download-resume`,
    {
      headers: {
        Accept: "application/pdf,application/octet-stream,*/*",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to download resume. Status: ${response.status}`);
  }

  const blob = await response.blob();
  const fileName =
    getFileNameFromDisposition(response.headers.get("Content-Disposition")) ||
    "resume.pdf";

  return { blob, fileName };
}

export async function fetchGitHubContributions(
  userId: string,
  year: number,
  signal?: AbortSignal,
): Promise<GitHubContributions> {
    if (!userId) {
    throw new Error("User ID is required to fetch user profile.");
  }

  if (!Number.isInteger(year) || year < 2008) {
    throw new Error("A valid GitHub contribution year is required.");
  }

  const params = new URLSearchParams({ year: String(year) });
  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(userId)}/contributions?${params.toString()}`,
    {
      cache: "no-store",
      signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub contributions. Status: ${response.status}`,
    );
  }

  const json = (await response.json()) as
    | GitHubContributionsResponse
    | GitHubContributions;
  const contributions = "data" in json ? json.data : json;

  if (!contributions || !Array.isArray(contributions.weeks)) {
    const message = "message" in json ? json.message : undefined;
    throw new Error(message || "GitHub contribution response was not successful.");
  }

  return contributions;
}

export type { GitHubContributions, UserProfile };
