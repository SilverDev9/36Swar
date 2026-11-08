import { Disc3, Home, Library, ListMusic, LogOut, Search, UserRound, ShieldCheck, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><Disc3 size={22}/></span>soundwave</div>
    <nav className="main-nav">
      <NavLink to="/"><Home size={19}/>Home</NavLink>
      <NavLink to="/search"><Search size={19}/>Search</NavLink>
      <NavLink to="/library"><Library size={19}/>Your library</NavLink>
      <NavLink to="/liked"><Heart size={18}/>Liked songs</NavLink>
      {user?.role === "admin" && <NavLink to="/admin"><ShieldCheck size={18}/>Admin studio</NavLink>}
    </nav>
    <div className="sidebar-divider"/>
    <div className="sidebar-label">YOUR SPACE</div>
    <NavLink to="/library"><ListMusic size={18}/>Playlists</NavLink>
    <div className="sidebar-bottom">
      <div className="user-chip"><UserRound size={17}/><span>{user?.name || "Listener"}</span></div>
      <button className="logout-button" onClick={logout}><LogOut size={16}/>Log out</button>
    </div>
  </aside>;
}
