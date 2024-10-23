import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AppState {
  pageName: string;
  builderLoading: boolean;
  pageLoading: boolean;
}

const initialState: AppState = {
  pageName: "",
  builderLoading: false,
  pageLoading: false,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setPageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    setBuilderLoading: (state, action: PayloadAction<boolean>) => {
      state.builderLoading = action.payload;
    },
  },
});

export const { setPageName, setBuilderLoading, setPageLoading } =
  appSlice.actions;
export const selectPageName = (state: RootState) => state.app.pageName;
export const selectBuilderLoading = (state: RootState) =>
  state.app.builderLoading;
export const selectPageLoading = (state: RootState) => state.app.pageLoading;
export default appSlice.reducer;
