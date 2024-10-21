import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AppState {
  pageName: string;
  loading: boolean;
}

const initialState: AppState = {
  pageName: "",
  loading: false,
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setPageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setPageName, setLoading } = appSlice.actions;
export const selectPageName = (state: RootState) => state.app.pageName;
export const selectIsLoading = (state: RootState) => state.app.loading;
export default appSlice.reducer;
