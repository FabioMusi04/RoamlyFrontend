import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import NavbarMenu from "./components/navbarMenu";
import Profile from "./pages/profilePage";
import FriendList from "./pages/friendList";
import AuthProvider from "./components/authProvider";
import PrivateRoute from "./components/privateRouting";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NavbarMenu/>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Register />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/friendList"
            element={
              <PrivateRoute>
                <FriendList />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
