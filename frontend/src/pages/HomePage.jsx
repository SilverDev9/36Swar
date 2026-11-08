import { useEffect, useState } from "react";
import { ArrowRight, Headphones, Search } from "lucide-react";
import api from "../services/api";
import { usePlayer } from "../context/PlayerContext";
import SongCard from "../components/SongCard";

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get("/songs").then(({ data }) => setSongs(data.songs))
      .catch(err => setError(err.response?.data?.message || "Could not load songs. Is the API running?"));
  }, []);

  return <div className="page-content">
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">A NEW WAY TO LISTEN</p>
        <h1>Find your<br/><span>next favourite.</span></h1>
        <p>Good music has a way of finding you. Start with something new.</p>
        <a className="hero-link" href="/search">Explore music <ArrowRight size={16}/></a>
      </div>
      <div className="hero-art"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-disc"><Headphones size={66}/></div><span className="art-dot dot-one"/><span className="art-dot dot-two"/></div>
    </section>
    <section className="section-block">
      <div className="section-heading"><div><p className="eyebrow">PICK UP THE VIBE</p><h2>Made for your ears</h2></div><a href="/search">View all <ArrowRight size={15}/></a></div>
      {error && <div className="notice">{error}</div>}
      {!error && songs.length === 0 && <div className="empty-state"><Search size={28}/><h3>Your next favourite is waiting</h3><p>No tracks have been added yet. An admin can upload the first songs to your catalogue.</p></div>}
      <div className="song-grid">{songs.map(song => <SongCard key={song._id} song={song} onPlay={s => playSong(s, songs)}/>)}</div>
    </section>
  </div>;
}
