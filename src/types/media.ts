type MediaBaseType = {
  name: string;
  type: string;
  url: string;
};

export type MediaType = MediaBaseType & {
  id: number;
  created_at: string;
  updated_at: string;
};

export type MediaResponse = { media: MediaType[] };
