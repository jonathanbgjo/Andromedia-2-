// App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";

export default function App() {
  return (
    <Routes>
      {/* Home: sidebar expanded by default */}
      <Route
        path="/"
        element={
          <MainLayout startCollapsed={false}>
            <Home />
          </MainLayout>
        }
      />

      {/* Watch: sidebar collapsed by default, but toggle still works */}
      <Route
        path="/watch/:id"
        element={
          <MainLayout startCollapsed={true}>
            <Watch />
          </MainLayout>
        }
      />
    </Routes>
  );
}
