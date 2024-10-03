import "./App.scss";
import AdminLayout from "./components/layout/AdminLayout";
import InstructorLayout from "./components/layout/InstructorLayout";

function App() {
  const userType: string = "instructor";

  // check user type
  return userType == "admin" ? <AdminLayout /> : <InstructorLayout />;
}

export default App;
