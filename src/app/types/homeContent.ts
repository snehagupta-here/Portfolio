import type { PersonalInfo, SocialLink } from "./portfolio";

export type HomeContentParagraph = {
  key: string;
  text: string;
};

export type HomeContentHighlight = {
  title: string;
  description: string;
};

export type HomeContent = {
  id: string;
  personalInfo: PersonalInfo;
  about: {
    picture: { src: string; alt: string };
    heading: string;
    paragraphs: HomeContentParagraph[];
    location: string;
    totalYearsExperience: string;
    projectsCompleted: string;
    resumeUrl: string;
    highlights: HomeContentHighlight[];
  };
  socialLinks: SocialLink[];
};
