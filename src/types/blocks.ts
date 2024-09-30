type BlockBaseType = {
  content: string;
  type: string;
};
export type BlockType = BlockBaseType & {
  id: number;
};
