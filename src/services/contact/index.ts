import { API_BASE_URL } from "@/app/config";

export type ContactUsPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactUsResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

export async function submitContactUs(payload: ContactUsPayload) {
  const response = await fetch(`${API_BASE_URL}/contact-us`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await response.json().catch(() => ({}))) as ContactUsResponse;

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Unable to send your message right now.");
  }

  return {
    message:
      json.message ||
      "Thank you for contacting, our team will reach out to you soon.",
  };
}
