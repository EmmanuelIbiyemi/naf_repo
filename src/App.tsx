import { useNavigate } from "react-router-dom";
import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import {
  selectCurrentUser,
  selectLastVisitedPage,
  setUserFromLocalStorage,
} from "./store/auth.slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { Box, LinearProgress } from "@mui/material";
import { selectIsLoading } from "./store/app.slice";

function App() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lastVisitedPage = useAppSelector(selectLastVisitedPage);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocalStorage());
      if (!user) navigate("/login");
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (user && lastVisitedPage) navigate(lastVisitedPage);
    // else {
    //   if (user?.role == "admin") navigate("/");
    //   else navigate("/instructor");
    // }
  }, [user]);

  // check user type
  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            color: "lightgreen",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 100,
          }}
        >
          <LinearProgress color="inherit" sx={{ height: "10px" }} />
        </Box>
      ) : null}
      {user?.role == "instructor" ? <InstructorLayout /> : <AdminLayout />}
    </Box>
  );
}

export default App;
