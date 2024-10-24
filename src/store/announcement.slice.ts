import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PostType } from "../types/posts";

interface AppState {
  current: PostType | undefined;
  all: PostType[];
}

const initialState: AppState = {
  current: undefined,
  all: [],
};

export const announcementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    addAnnouncement: (state, action: PayloadAction<PostType>) => {
      const announcement = action.payload;
      if (typeof announcement.id !== "number") {
        announcement.id = state.all.length;
      }

      const foundIndex = state.all.findIndex((f) => f.id === announcement.id);
      if (foundIndex !== -1) {
        state.all[foundIndex] = announcement;
      } else {
        state.all.push(announcement);
      }
    },
    removeAnnouncement: (state, action: PayloadAction<number>) => {
      state.all = state.all.filter(
        (announcement) => announcement.id !== action.payload
      );
      if (state.current?.id === action.payload) {
        state.current = undefined;
      }
    },
    setCurrentAnnouncement: (
      state,
      action: PayloadAction<PostType | undefined>
    ) => {
      state.current = action.payload;
    },
  },
});

export const { addAnnouncement, removeAnnouncement, setCurrentAnnouncement } =
  announcementSlice.actions;

export const selectAnnouncement = (state: RootState) => state.announcements.all;
export const selectCurrentAnnouncement = (state: RootState) =>
  state.announcements.current;

export default announcementSlice.reducer;
