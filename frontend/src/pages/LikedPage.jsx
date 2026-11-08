import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "../services/api";
import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "../context/AuthContext";
import SongCard from "../components/SongCard";

export default function LikedPage() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();
  const { likedSongIds } = useAuth();
  const visibleSongs = songs.filter(song => likedSongIds.includes(song._id));
  useEffect(() => {
    api.get("/likes").then(({ data }) => setSongs(data.songs))
      .catch(err => setError(err.response?.data?.message || "Could not load liked songs."));
  }, []);
  return <div className="page-content">
    <div className="page-title"><p className="eyebrow">YOUR COLLECTION</p><h1>Liked songs</h1><p>The tracks you want to come back to.</p></div>
    {error && <div className="notice">{error}</div>}
    {visibleSongs.length ? <div className="song-grid">{visibleSongs.map(song => <SongCard key={song._id} song={song} onPlay={s => playSong(s, songs)}/>)}</div>
      : !error && <div className="empty-state"><Heart size={28}/><h3>Your favourites live here</h3><p>Tap the heart on any track to save it to this collection.</p></div>}
  </div>;
}
