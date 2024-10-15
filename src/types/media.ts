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
