import { API_BASE_URL } from "@/app/config";
import type { BlogPost, BlogSection } from "@/app/types/blog";
import type {
  BlogApiImage,
  BlogApiItem,
  BlogApiSection,
  BlogApiSubHeadingItem,
  BlogResponse,
} from "./type";

const toImageUrl = (image: BlogApiImage | undefined) =>
  (image?.secureUrl || image?.secure_url || image?.url || image?.src || "").trim();

const toImageUrls = (images: BlogApiImage[] | undefined) =>
  (images || []).map(toImageUrl).filter(Boolean);

const toSubHeadingItem = (item: BlogApiSubHeadingItem) => ({
  subHeading: item.subHeading,
  description: item.description || "",
  points: item.points || [],
  images: toImageUrls(item.images),
  codeSnippet: item.codeSnippet || [],
});

const toBlogSection = (section: BlogApiSection, index: number): BlogSection => ({
  id: section.id || `section-${index + 1}`,
  contentType: section.contentType || "headingBased",
  type: section.type || "section",
  heading: section.heading || `Section ${index + 1}`,
  text: section.text || "",
  images: toImageUrls(section.images),
  items: section.items?.map(toSubHeadingItem) || [],
  points: section.points || [],
  codeSnippet: section.codeSnippet || [],
  questions: section.questions || [],
});

const getFirstImage = (sections: BlogSection[]) => {
  for (const section of sections) {
    const sectionImage = section.images?.[0];
    if (sectionImage) return sectionImage;

    for (const item of section.items || []) {
      const itemImage = item.images?.[0];
      if (itemImage) return itemImage;
    }
  }

  return "";
};

const normalizeBlogPost = (post: BlogApiItem): BlogPost => {
  const sections = (post.content || []).map(toBlogSection);
  const firstImage = getFirstImage(sections);

  return {
    id: post.slug || post._id,
    title: post.title,
    summary: post.description || post.seo?.metaDescription || "",
    content: sections.map((section) => section.text).filter(Boolean).join("\n\n"),
    thumbnail: firstImage,
    banner: firstImage,
    date: post.metadata?.publishedDate || post.createdAt,
    readingTime: post.metadata?.readTime || 1,
    author: post.author?.name ? { name: post.author.name, avatar: post.author.avatar } : undefined,
    tags: post.seo?.keywords || [],
    sections,
    featured: post.metadata?.featured,
  };
};

export async function fetchBlogPosts(userId: string): Promise<BlogPost[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch blog posts.");
  }

  const response = await fetch(
    `${API_BASE_URL}/blog/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch blog posts. Status: ${response.status}`);
  }

  const json = (await response.json()) as BlogResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Blog response was not successful.");
  }

  return json.data
    .filter((post) => post.isActive !== false)
    .map(normalizeBlogPost);
}
