import { API_BASE_URL } from "@/app/config";
import type {
  CICD,
  CICDPipelineStep,
  CodeSnippet,
  ContentPoint,
  ContentSection,
  ContentSubItem,
  DeploymentItem,
  PerformanceItem,
  ProjectPage,
  RichImage,
  RichProject,
  TestingItem,
} from "@/app/data/richProjectData";
import type {
  ProjectApiContentPoint,
  ProjectApiContentSection,
  ProjectApiImage,
  ProjectApiItem,
  ProjectResponse,
} from "./type";

const toImageUrl = (image: ProjectApiImage | undefined) =>
  (image?.secureUrl || image?.secure_url || image?.url || image?.src || "").trim();

const toRichImage = (
  image: ProjectApiImage | undefined,
  fallbackAlt: string,
): RichImage | undefined => {
  const url = toImageUrl(image);
  if (!url) return undefined;

  return {
    url,
    alt:
      image?.alt ||
      image?.originalFilename ||
      image?.original_filename ||
      fallbackAlt,
    caption: image?.caption,
  };
};

const toContentPoint = (
  point: ProjectApiContentPoint,
  index: number,
): ContentPoint => ({
  label: point.label || `Point ${index + 1}`,
  description: point.description || "",
});

const toCodeSnippet = (snippet: unknown, index: number): CodeSnippet => {
  const value = snippet && typeof snippet === "object" ? snippet as Partial<CodeSnippet> : {};

  return {
    filename: value.filename || `snippet-${index + 1}`,
    language: value.language || "typescript",
    description: value.description || "",
    code: value.code || "",
  };
};

const toSubItem = (
  item: ProjectApiContentSection["items"] extends Array<infer T> ? T : never,
): ContentSubItem => ({
  subHeading: item.subHeading,
  paragraphs: item.paragraphs || [],
  points: item.points || [],
  images: item.images
    ?.map((image, imageIndex) =>
      toRichImage(image, `${item.subHeading} image ${imageIndex + 1}`),
    )
    .filter((image): image is RichImage => Boolean(image)),
  codeSnippets: item.codeSnippets?.map((snippet, snippetIndex) =>
    toCodeSnippet(snippet, snippetIndex),
  ),
});

const toContentSection = (
  section: ProjectApiContentSection,
  sectionIndex: number,
): ContentSection => ({
  id: section.id || `section-${sectionIndex + 1}`,
  contentType: section.contentType || "headingBased",
  type: section.type || "section",
  heading: section.heading || `Section ${sectionIndex + 1}`,
  paragraphs: section.paragraphs || [],
  images: section.images
    ?.map((image, imageIndex) =>
      toRichImage(image, `${section.heading || "Project"} image ${imageIndex + 1}`),
    )
    .filter((image): image is RichImage => Boolean(image)),
  points: section.points?.map(toContentPoint),
  codeSnippets: section.codeSnippets?.map((snippet, snippetIndex) =>
    toCodeSnippet(snippet, snippetIndex),
  ),
  items: section.items?.map((item) => toSubItem(item)),
  questions: section.questions || [],
});

const toSettingsRecord = (
  settings: unknown,
): Record<string, string | number> => {
  if (Array.isArray(settings)) {
    return settings.reduce<Record<string, string | number>>((acc, item) => {
      if (!item || typeof item !== "object") return acc;
      const entry = item as { key?: unknown; value?: unknown };
      if (typeof entry.key !== "string") return acc;
      if (typeof entry.value === "string" || typeof entry.value === "number") {
        acc[entry.key] = entry.value;
      }
      return acc;
    }, {});
  }

  if (settings && typeof settings === "object") {
    return Object.entries(settings as Record<string, unknown>).reduce<
      Record<string, string | number>
    >((acc, [key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  return {};
};

const toPages = (pages: unknown): ProjectPage[] | undefined => {
  if (!Array.isArray(pages)) return undefined;

  return pages.map((page, index) => {
    const item = page && typeof page === "object" ? page as Record<string, unknown> : {};
    const pageName = String(item.pageName || item.name || `Page ${index + 1}`);

    return {
      id: String(item.id || `page-${index + 1}`),
      name: pageName,
      route: String(item.route || ""),
      access: String(item.access || "public"),
      layout: String(item.layout || ""),
      description: String(item.description || ""),
      purpose: String(item.purpose || item.description || ""),
      sections: Array.isArray(item.sections) ? item.sections as ProjectPage["sections"] : [],
      rendering: String(item.rendering || ""),
    };
  });
};

const toCicd = (cicd: unknown): CICD | undefined => {
  if (!cicd || typeof cicd !== "object") return undefined;
  const item = cicd as Record<string, unknown>;
  const pipelineSource = Array.isArray(item.pipeline) ? item.pipeline : item.steps;
  const pipeline: CICDPipelineStep[] = Array.isArray(pipelineSource)
    ? pipelineSource.map((step, index) => {
        if (typeof step === "string") {
          return { step: index + 1, name: step, command: "" };
        }

        const stepItem = step && typeof step === "object"
          ? step as Partial<CICDPipelineStep>
          : {};

        return {
          step: typeof stepItem.step === "number" ? stepItem.step : index + 1,
          name: stepItem.name || `Step ${index + 1}`,
          command: stepItem.command || "",
        };
      })
    : [];

  return {
    tool: String(item.tool || ""),
    trigger: String(item.trigger || ""),
    pipeline,
    blockers: String(item.blockers || ""),
  };
};

const toDeployment = (deployment: unknown): DeploymentItem[] | undefined => {
  if (!Array.isArray(deployment)) return undefined;

  return deployment.map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const type = String(record.type || record.target || `deployment-${index + 1}`);
    const details = Array.isArray(record.details)
      ? record.details as Record<string, string>[]
      : [Object.entries(record).reduce<Record<string, string>>((acc, [key, value]) => {
          if (key === "type") return acc;
          if (value === null || value === undefined || value === "") return acc;
          acc[key] = String(value);
          return acc;
        }, {})].filter((detail) => Object.keys(detail).length > 0);

    return { type, details };
  });
};

const toPerformance = (items: unknown): PerformanceItem[] | undefined => {
  if (!Array.isArray(items)) return undefined;

  return items.map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};

    return {
      id: String(record.id || `performance-${index + 1}`),
      type: String(record.type || ""),
      name: String(record.name || record.title || `Performance ${index + 1}`),
      description: String(record.description || ""),
      layer: String(record.layer || ""),
      target: record.target && typeof record.target === "object"
        ? record.target as PerformanceItem["target"]
        : { entity: "", scope: "" },
      configuration: {
        tool: String(record.tool || ""),
        strategy: String(record.strategy || ""),
        settings: toSettingsRecord(record.settings),
      },
      triggers: Array.isArray(record.triggers)
        ? record.triggers.map(String)
        : Array.isArray(record.invalidationTriggers)
          ? record.invalidationTriggers.map(String)
          : [],
      metrics: {
        expectedImprovement: String(record.expectedImprovement || ""),
        complexityImpact: String(record.complexityImpact || ""),
      },
      status: String(record.status || ""),
    };
  });
};

const toTesting = (items: unknown): TestingItem[] | undefined => {
  if (!Array.isArray(items)) return undefined;

  return items.map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};

    return {
      id: String(record.id || `testing-${index + 1}`),
      type: String(record.type || ""),
      name: String(record.name || record.title || `Test ${index + 1}`),
      description: String(record.description || ""),
      layer: String(record.layer || ""),
      tools: Array.isArray(record.tools) ? record.tools.map(String) : [],
      target: {
        scope: Array.isArray(record.scope) ? record.scope.map(String) : String(record.scope || ""),
        filePattern: String(record.filePattern || ""),
      },
      configuration: {
        environment: String(record.environment || ""),
        mocking: String(record.mocking || ""),
        databaseReset: String(record.databaseReset || ""),
      },
      coverage: {
        targetPercentage: Number(record.coverageTarget || record.targetPercentage || 0),
        focusAreas: Array.isArray(record.coverageAreas)
          ? record.coverageAreas.map(String)
          : [],
      },
      status: String(record.status || ""),
    };
  });
};

const normalizeProject = (project: ProjectApiItem): RichProject => {
  const firstContentImage = project.content
    ?.flatMap((section) => section.images || [])
    .find((image) => toImageUrl(image));
  const fallbackImage = firstContentImage || project.images?.find((image) => toImageUrl(image));
  const banner = toRichImage(project.banner, `${project.title} banner`) ||
    toRichImage(fallbackImage, `${project.title} banner`) || {
      url: "",
      alt: `${project.title} banner`,
    };
  const thumbnail = toRichImage(project.thumbnail, `${project.title} thumbnail`) ||
    toRichImage(fallbackImage, `${project.title} thumbnail`) ||
    banner;

  return {
    slug: project.slug,
    title: project.title,
    tagline: project.tagline || "",
    shortDescription: project.shortDescription || "",
    meta: {
      category: project.meta?.category || "project",
      projectType: project.meta?.projectType || [],
      difficulty: project.meta?.difficulty || "",
      status: project.meta?.status || "",
      featured: project.meta?.featured ?? true,
      estimatedReadTime: project.meta?.estimatedReadTime || "",
      tags: project.meta?.tags || [],
      completedAt: project.meta?.completedAt || "",
      duration: project.meta?.duration || "",
    },
    banner,
    thumbnail,
    content: project.content?.map(toContentSection) || [],
    apis: project.apis,
    database: project.database,
    futureImprovements: project.futureImprovements,
    performance: toPerformance(project.performance),
    testing: toTesting(project.testing),
    folderStructure: project.folderStructure,
    pages: toPages(project.pages),
    cicd: toCicd(project.cicd),
    deployment: toDeployment(project.deployment),
    environmentVariables: project.environmentVariables,
  };
};

export async function fetchProjects(userId: string): Promise<RichProject[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch projects.");
  }

  const response = await fetch(
    `${API_BASE_URL}/project/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch projects. Status: ${response.status}`);
  }

  const json = (await response.json()) as ProjectResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Project response was not successful.");
  }

  return json.data.map(normalizeProject);
}
