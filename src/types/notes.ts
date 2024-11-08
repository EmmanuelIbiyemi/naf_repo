import { media, mediaInput } from "./media";
import { Participant } from "./participants";

export type note = {
  content: string;
  created_at: string;
  id: number;
  media: media;
  title: string;
  updated_at: string;
};
export type NoteResponse = { data: note[] };


export type noteInput = {
  title: string;
  content: string;
  course_id: number;
  media: mediaInput;
};

export type shareNoteInput = {
  note_id: number;
  participants: Participant;
};
