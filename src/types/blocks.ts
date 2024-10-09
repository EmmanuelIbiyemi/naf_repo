type BlockBaseType = {
  content: string;
  type: string;
};
export type BlockType = BlockBaseType & {
  id: number;
};

export type BlockType2 = {
  caption: string;
  content: string;
  link: string;
  media: { id: number }[];
  position: number;
  title: string;
  type: string;
};
