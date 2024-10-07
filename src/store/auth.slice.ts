import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { UserType } from "../types/users";

interface UsersState {
  user: UserType | null;
  access_token: string;
  refresh_token: string;
}

const initialState: UsersState = {
  user: null,
  access_token: "",
  refresh_token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UsersState>) => {
      const { access_token, refresh_token, user } = action.payload;
      state.user = user;
      state.access_token = access_token;
      state.refresh_token = refresh_token;

      console.log(action.payload);

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

    logout: (state) => {
      state.access_token = "";
      state.refresh_token = "";
      state.user = null;
      localStorage.clear();
      sessionStorage.clear();
    },
  },
});

export const { login, setAccessToken, setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentAccessToken = (state: RootState) =>
  state.auth.access_token;
export const selectCurrentRefreshToken = (state: RootState) =>
  state.auth.refresh_token;
