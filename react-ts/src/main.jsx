// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom"; // 👈 IMPORTA Routes y Route
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import App from "./App.jsx";
import { MovieDetailPage } from "./components/MovieDetailPage.jsx";
import { LoginPage } from "./components/LoginPage.jsx";
import { AdminPage } from "./components/AdminPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>           
      <HashRouter basename="/carteleraDesarrollo">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter >
    </AuthProvider>
  </React.StrictMode>
);
