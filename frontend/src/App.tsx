import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Channel from "./pages/Channel";
import Subscriptions from "./pages/Subscriptions";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import History from "./pages/History";
import Trending from "./pages/Trending";
import ComingSoon from "./pages/ComingSoon";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/channel/:id" element={<Channel />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/upload" element={<RequireAuth><Upload /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/library" element={<Library />} />
          <Route path="/history" element={<History />} />
          <Route path="/shorts" element={<ComingSoon feature="Shorts" emoji="⚡" />} />
          <Route path="/liked" element={<ComingSoon feature="Liked videos" emoji="👍" />} />
          <Route path="*" element={<div style={{padding:16}}>Not Found</div>} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
