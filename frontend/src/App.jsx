import './App.css';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Watch from './pages/Watch';
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/watch/:id" element={<Watch />} />
    </Routes>
  );
}

export default App;
