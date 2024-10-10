import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import LoadingScreen from "./components/LoadingScreen.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import "@mdxeditor/editor/style.css";

const theme = createTheme({
  palette: {
    primary: {
      light: "rgba(0, 102, 195, 1)",
      main: "rgba(2, 54, 120, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(31, 31, 31, 1)",
      main: "rgba(20, 20, 20, 1)",
      contrastText: "#fff",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
