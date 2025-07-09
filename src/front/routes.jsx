// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import Landing from "./pages/Landing";
import Register from "./components/Register";
import Feed from "./pages/Feed";
import AboutUs from "./pages/About_us";
import ChatApp from "./components/ChatApp";
import Perfil from "./pages/Perfil";
import SupportPage from "./pages/Soporte";
import Projects from "./pages/Projects";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Rutas públicas */}
      <Route index element={<Landing />} />
      <Route path="register" element={<Register />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="feed" element={<Feed />} />
        <Route path="about_us" element={<AboutUs />} />
        <Route path="chat" element={<ChatApp />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="soporte" element={<SupportPage />} />
        <Route path="proyectos" element={<Projects />} />
      </Route>
    </Route>
  )
);
