export interface CreateBlog {
  title: string;
  slug: string;
  description?: string;
  content?: any[];
  media?: any;
  author?: any;
  metadata?: any;
  seo?: any;
  isActive?: boolean;
}

export type UpdateBlog = Partial<CreateBlog>;
