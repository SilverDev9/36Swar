import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedSongIds, setLikedSongIds] = useState([]);

  async function refreshLikes() {
    try { const { data } = await api.get("/likes"); setLikedSongIds(data.songs.map(song => song._id)); } catch { setLikedSongIds([]); }
  }

  async function toggleLike(songId) {
    const liked = likedSongIds.includes(songId);
    setLikedSongIds(ids => liked ? ids.filter(id => id !== songId) : [...ids, songId]);
    try { await (liked ? api.delete(`/likes/${songId}`) : api.post(`/likes/${songId}`)); }
    catch (error) { setLikedSongIds(ids => liked ? [...ids, songId] : ids.filter(id => id !== songId)); throw error; }
  }

  useEffect(() => {
    const token = localStorage.getItem("soundwave_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(async ({ data }) => { setUser(data.user); await refreshLikes(); })
      .catch(() => localStorage.removeItem("soundwave_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("soundwave_token", data.token);
    setUser(data.user);
    await refreshLikes();
  }

  async function register(details) {
    const { data } = await api.post("/auth/register", details);
    localStorage.setItem("soundwave_token", data.token);
    setUser(data.user);
    await refreshLikes();
  }

  function logout() {
    localStorage.removeItem("soundwave_token");
    setUser(null);
    setLikedSongIds([]);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, likedSongIds, toggleLike }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
