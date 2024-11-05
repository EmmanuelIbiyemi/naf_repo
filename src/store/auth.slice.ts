import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { UserType } from "../types/users";

type UserLoginResponse = {
  user: UserType | null;
  access_token: string;
  refresh_token: string;
};

type AdditionalUserState = {
  lastVisitedPage: string;
};

const initialState: UserLoginResponse & AdditionalUserState = {
  user: null,
  access_token: "",
  refresh_token: "",
  lastVisitedPage: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserLoginResponse>) => {
      const { access_token, refresh_token, user } = action.payload;
      state.user = user;
      state.access_token = access_token;
      state.refresh_token = refresh_token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    },

    setAccessToken: (
      state,
      action: PayloadAction<{ access_token: string }>
    ) => {
      const { access_token } = action.payload;
      state.access_token = access_token;
      localStorage.setItem("access_token", access_token);
    },

    setUser: (state, action: PayloadAction<{ user: UserType }>) => {
      const { user } = action.payload;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },

    setUserFromLocalStorage: (state) => {
      const local_user = localStorage.getItem("user");
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");

      if (local_user && access_token && refresh_token) {
        state.access_token = access_token;
        state.refresh_token = refresh_token;
        state.user = JSON.parse(local_user);
      }
    },

    setLastVisitedPage: (state, action: PayloadAction<string>) => {
      const page = action.payload;
      state.lastVisitedPage = page;
      sessionStorage.setItem("lastVisitedPage", page);
    },

    logout: (state) => {
      state.access_token = "";
      state.refresh_token = "";
      state.user = null;
      state.lastVisitedPage = "";
      localStorage.clear();
      sessionStorage.clear();
    },
  },
});

export const {
  login,
  setAccessToken,
  setUser,
  setUserFromLocalStorage,
  setLastVisitedPage,
  logout,
} = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentAccessToken = (state: RootState) =>
  state.auth.access_token;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.auth.refresh_token;
export const selectLastVisitedPage = (state: RootState) =>
  state.auth.lastVisitedPage;
