export interface Post {
  id: number;
  title: string;
  slug: string;
  date: string;
  featured_image: string;
  blocks: Block[];
  categories: Category[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Block {
  text: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PostsResponseAnnouncement {
  message: string;
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
  post: Post[];
}
