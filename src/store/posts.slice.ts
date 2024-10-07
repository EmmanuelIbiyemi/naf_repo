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

export const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<PostType>) => {
      const form = action.payload;
      const foundIndex = state.all.findIndex((f) => f.id === form.id);

      if (foundIndex !== -1) {
        console.log("found");
        state.all[foundIndex] = form;
      } else {
        console.log("not found");
        state.all.push({ ...form, id: state.all.length });
      }
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.all = state.all.filter((form) => form.id === action.payload);
    },
    setCurrentPost: (state, action: PayloadAction<PostType | undefined>) => {
      state.current = action.payload;
    },
  },
});

export const { addPost, removePost, setCurrentPost } = postSlice.actions;
export const selectPosts = (state: RootState) => state.posts.all;
export const selectCurrentPost = (state: RootState) => state.posts.current;
export default postSlice.reducer;
