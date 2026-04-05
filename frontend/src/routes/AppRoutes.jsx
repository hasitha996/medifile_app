import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import MainLayout  from "../layouts/MainLayout";
import AuthLayout  from "../layouts/AuthLayout";

import Home         from "../pages/Home/Home";
import FileUpload   from "../pages/Files/FileUpload";
import FileTransfer from "../pages/Files/FileTransfer";
import Voicebot     from "../pages/Voicebot/Voicebot";
import Users        from "../pages/Users/Users";
import UserForm     from "../pages/Users/UserForm";
import Login        from "../pages/Auth/Login";
import Register     from "../pages/Auth/Register";

// Guard: redirect unauthenticated users to /login
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public auth routes (no navbar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/"                element={<Home />} />
        <Route path="/files"           element={<FileUpload />} />
        <Route path="/files/transfer"  element={<FileTransfer />} />
        <Route path="/voicebot"        element={<Voicebot />} />
        {/* Patient management (repurposed Users CRUD) */}
        <Route path="/patients"        element={<Users />} />
        <Route path="/patients/new"    element={<UserForm />} />
        <Route path="/patients/:id/edit" element={<UserForm />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
