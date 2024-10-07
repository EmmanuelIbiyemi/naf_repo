import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./api/app.api";
import appReducer from "./app.slice";
import formsReducer from "./forms.slice";
import postsReducer from "./posts.slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    forms: formsReducer,
    posts: postsReducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
