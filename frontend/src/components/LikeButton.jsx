import { Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LikeButton({ songId }) {
  const { likedSongIds, toggleLike } = useAuth();
  const [busy, setBusy] = useState(false);
  const liked = likedSongIds.includes(songId);
  async function handleClick(e) {
    e.stopPropagation();
    setBusy(true);
    try { await toggleLike(songId); } catch { /* Auth context rolls back optimistic state. */ }
    finally { setBusy(false); }
  }
  return <button type="button" className={`icon-button like-button ${liked ? "is-liked" : ""}`} onClick={handleClick} disabled={busy} aria-label={liked ? "Unlike song" : "Like song"} title={liked ? "Unlike" : "Like"}>
    <Heart size={17} fill={liked ? "currentColor" : "none"}/>
  </button>;
}
