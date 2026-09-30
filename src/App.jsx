import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import NotFoundPage from "./Pages/NotFoundPage";
import ProfilePage from "./Pages/ProfilePage";
import RegistrationPage from "./Pages/RegistrationPage";
import PrivateRoutes from "./routes/PrivateRoutes";

export default function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes/>}>
        <Route element={<Home />} path="/"></Route>
        <Route element={<ProfilePage />} path="/me"></Route>
      </Route>

      <Route element={<RegistrationPage />} path="/register"></Route>
      <Route element={<Login />} path="/login"></Route>
      <Route element={<NotFoundPage />} path="*"></Route>
    </Routes>
  );
}
