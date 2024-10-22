interface medias {
  created_at: string;
  id: number;
  name: string;
  type: string;
  updated_at: string;
  url: string;
}

interface mediaInputs {
  id: string;
}

export type media = medias[];
export type mediaInput = mediaInputs[];
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
