export type PageBlock = {
  caption: string;
  content: string;
  id: number;
  link: string;
  media: { id: number }[] | null;
  position: number;
  title: string;
  type: string;
};

export type PageType = {
  id: number;
  blocks: PageBlock[];
  title: string;
};
