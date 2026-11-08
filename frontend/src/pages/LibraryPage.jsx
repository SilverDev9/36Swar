import { useEffect, useState } from "react";
import { ListMusic, Plus, Trash2, X } from "lucide-react";
import api from "../services/api";
import { usePlayer } from "../context/PlayerContext";

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { playSong } = usePlayer();

  async function load() {
    try { const { data } = await api.get("/playlists"); setPlaylists(data.playlists); }
    catch (err) { setError(err.response?.data?.message || "Could not load playlists."); }
  }
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault(); if (!name.trim()) return;
    try { await api.post("/playlists", { name }); setName(""); load(); }
    catch (err) { setError(err.response?.data?.message || "Could not create playlist."); }
  }

  async function remove(id) {
    try { await api.delete(`/playlists/${id}`); load(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete playlist."); }
  }

  return <div className="page-content">
    <div className="page-title"><p className="eyebrow">YOUR COLLECTION</p><h1>Your library</h1><p>Keep the sounds you love close.</p></div>
    <form className="create-playlist" onSubmit={create}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Give your playlist a name" maxLength="80"/>
      <button className="primary-button"><Plus size={17}/> Create playlist</button>
    </form>
    {error && <div className="notice">{error}</div>}
    <div className="playlist-list">
      {playlists.map(list => <section className="playlist-panel" key={list._id}>
        <div className="playlist-heading"><div className="playlist-icon"><ListMusic/></div><div><h3>{list.name}</h3><p>{list.songs.length} tracks</p></div><button className="icon-button danger" onClick={() => remove(list._id)} aria-label="Delete playlist"><Trash2 size={17}/></button></div>
        {list.songs.map(song => <div className="playlist-song-row" key={song._id}>
          <button className="playlist-song" onClick={() => playSong(song, list.songs)}>
            <img src={song.coverUrl || "https://placehold.co/48x48/20242e/ffffff?text=SW"} alt=""/><span>{song.title}</span><small>{song.artist}</small>
          </button>
          <button className="icon-button danger" aria-label={`Remove ${song.title} from playlist`} title="Remove from playlist" onClick={async () => {
            try { await api.delete(`/playlists/${list._id}/songs/${song._id}`); load(); }
            catch (err) { setError(err.response?.data?.message || "Could not remove track."); }
          }}><X size={16}/></button>
        </div>)}
        {list.songs.length === 0 && <p className="muted-copy">This playlist is empty. Use the add-to-playlist control on any track to fill this playlist.</p>}
      </section>)}
    </div>
  </div>;
}
