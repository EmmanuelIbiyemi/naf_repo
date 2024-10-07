import { useNavigate } from "react-router-dom";
import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";
import { selectCurrentUser } from "./store/auth.slice";
import { useAppSelector } from "./store/hooks";
import { useEffect } from "react";

function App() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  // check user type
  return user?.role == "instructor" ? <InstructorLayout /> : <AdminLayout />;
}

export default App;
