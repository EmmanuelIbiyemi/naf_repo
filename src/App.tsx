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

function App() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lastVisitedPage = useAppSelector(selectLastVisitedPage);

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
  return user?.role == "instructor" ? <InstructorLayout /> : <AdminLayout />;
}

export default App;
