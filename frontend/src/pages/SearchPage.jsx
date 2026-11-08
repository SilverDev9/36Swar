import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../services/api";
import SongCard from "../components/SongCard";
import { usePlayer } from "../context/PlayerContext";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  useEffect(() => {
    const timer = setTimeout(() => {
      api.get("/songs", { params: query ? { search: query } : {} })
        .then(({ data }) => { setSongs(data.songs); setError(""); })
        .catch(() => setError("Search is unavailable. Check the API connection."));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return <div className="page-content">
    <div className="page-title"><p className="eyebrow">DISCOVER</p><h1>Search music</h1><p>Find a track, artist or sound.</p></div>
    <div className="search-box"><Search size={20}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you want to listen to?"/></div>
    {error && <div className="notice">{error}</div>}
    <div className="song-grid search-results">{songs.map(song => <SongCard key={song._id} song={song} onPlay={s => playSong(s, songs)}/>)}</div>
    {!error && songs.length === 0 && <div className="empty-state"><Search size={28}/><h3>No tracks found</h3><p>Try another title, artist or genre.</p></div>}
  </div>;
}
