export type BlockType = {
  caption: string;
  content: string;
  id: number;
  link: string;
  media: { id: number }[] | null;
  position: number;
  title: string;
  type: string;
};
