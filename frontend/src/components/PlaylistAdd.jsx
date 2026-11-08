import { ListPlus } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

export default function PlaylistAdd({ songId }) {
  const [playlists, setPlaylists] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function open() {
    setMessage("");
    if (playlists) { setPlaylists(null); return; }
    setBusy(true);
    try { const { data } = await api.get("/playlists"); setPlaylists(data.playlists); }
    catch (error) { setMessage(error.response?.data?.message || "Could not load playlists."); }
    finally { setBusy(false); }
  }
  async function add(id) {
    setBusy(true);
    try { await api.post(`/playlists/${id}/songs`, { songId }); setMessage("Added to playlist"); setPlaylists(null); }
    catch (error) { setMessage(error.response?.data?.message || "Could not add track."); }
    finally { setBusy(false); }
  }
  return <span className="playlist-add-wrap">
    <button type="button" className="icon-button" onClick={open} disabled={busy} aria-label="Add to playlist" title="Add to playlist"><ListPlus size={17}/></button>
    {playlists && <span className="playlist-popover">{playlists.length ? playlists.map(list => <button key={list._id} onClick={() => add(list._id)}>{list.name}</button>) : <small>Create a playlist in Your library first.</small>}</span>}
    {message && <small className="inline-feedback">{message}</small>}
  </span>;
}
