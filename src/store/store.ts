import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./api/app.api";
import appReducer from "./app.slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
