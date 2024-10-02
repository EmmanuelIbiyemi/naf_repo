import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AppState {
  pageName: string;
}

const initialState: AppState = {
  pageName: "",
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setPageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },
  },
});

export const { setPageName } = appSlice.actions;
export const selectPageName = (state: RootState) => state.app.pageName;
export default appSlice.reducer;
