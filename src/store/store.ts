import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./api/app.api";
import appReducer from "./app.slice";
import formsReducer from "./forms.slice";
import postsReducer from "./posts.slice";
import announcementReducer from "./announcement.slice";
import { authApiSlice } from "./api/auth.api";
import { authReducer } from "./auth.slice";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    app: appReducer,
    forms: formsReducer,
    posts: postsReducer,
    announcements: announcementReducer,
    [appApi.reducerPath]: appApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(appApi.middleware)
      .concat(authApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
