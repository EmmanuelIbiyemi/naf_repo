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
      const post = action.payload;
      const foundIndex = state.all.findIndex((f) => f.id === post.id);

      if (foundIndex !== -1) {
        console.log("found");
        state.all[foundIndex] = post;
      } else {
        console.log("not found");
        state.all.push({ ...post, id: state.all.length });
      }
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.all = state.all.filter((post) => post.id !== action.payload);
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
