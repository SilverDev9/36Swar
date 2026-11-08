import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import AdminPage from "./pages/AdminPage";
import LikedPage from "./pages/LikedPage";

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading SoundWave...</div>;
  if (!user) return <AuthPage/>;
  return <div className="app-shell"><Sidebar/><main className="main-area"><header className="topbar"><span>Good music. Good energy.</span><div className="topbar-status"><span className="status-dot"/> YOUR SPACE</div></header><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/search" element={<SearchPage/>}/>
    <Route path="/library" element={<LibraryPage/>}/>
    <Route path="/liked" element={<LikedPage/>}/>
    <Route path="/admin" element={user?.role === "admin" ? <AdminPage/> : <Navigate to="/" replace/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></main><Player/></div>;
}

export default function App() {
  return <Routes><Route path="/*" element={<ProtectedLayout/>}/></Routes>;
}
