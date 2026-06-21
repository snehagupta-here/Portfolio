import { API_BASE_URL } from "@/app/config";
import type {
  Testimonial,
  TestimonialApiImage,
  TestimonialApiItem,
  TestimonialImage,
  TestimonialResponse,
} from "./type";

const toTestimonialImage = (
  image: TestimonialApiImage | undefined,
  fallbackAlt: string,
): TestimonialImage | undefined => {
  if (!image) return undefined;

  const url = (image.secureUrl || image.secure_url || image.url || image.src)?.trim();
  if (!url) return undefined;

  const filename = image.originalFilename || image.original_filename;

  return {
    url,
    alt: image.alt || filename || fallbackAlt,
    width: image.width,
    height: image.height,
  };
};

const normalizeTestimonial = (testimonial: TestimonialApiItem): Testimonial => ({
  _id: testimonial._id,
  user_id: testimonial.user_id,
  name: testimonial.name,
  description: testimonial.description,
  designation: testimonial.designation,
  rating: testimonial.rating,
  testimonial_date: testimonial.testimonial_date,
  createdAt: testimonial.createdAt,
  updatedAt: testimonial.updatedAt,
  image: toTestimonialImage(
    testimonial.image,
    `${testimonial.name} testimonial image`,
  ),
});

export async function fetchTestimonials(userId: string): Promise<Testimonial[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch testimonials.");
  }

  const response = await fetch(
    `${API_BASE_URL}/testimonial/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch testimonials. Status: ${response.status}`);
  }

  const json = (await response.json()) as TestimonialResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || "Testimonial response was not successful.");
  }

  return json.data.map(normalizeTestimonial);
}

export type { Testimonial };
