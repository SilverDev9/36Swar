import { useCallback, useEffect, useState } from "react";
import { Activity, Disc3, Music2, Trash2, UploadCloud, RefreshCw } from "lucide-react";
import api from "../services/api";

const emptyForm = { title: "", artist: "", album: "", genre: "Pop", audio: null, cover: null };
const prettySize = bytes => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export default function AdminPage() {
  const [form, setForm] = useState(emptyForm);
  const [songs, setSongs] = useState([]);
  const [stats, setStats] = useState({ totalSongs: 0, totalPlays: 0 });
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: catalogue }, { data: overview }] = await Promise.all([
        api.get("/songs"), api.get("/songs/admin/stats")
      ]);
      setSongs(catalogue.songs);
      setStats(overview.stats);
    } catch (error) {
      setNotice({ type: "error", text: error.response?.data?.message || "Unable to load admin data." });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function update(key, value) { setForm(current => ({ ...current, [key]: value })); }

  async function submit(e) {
    e.preventDefault();
    setNotice({ type: "", text: "" });
    if (!form.title.trim() || !form.artist.trim() || !form.audio) {
      setNotice({ type: "error", text: "Track title, artist and an audio file are required." }); return;
    }
    if (!form.audio.type.startsWith("audio/") && form.audio.type !== "video/mp4") {
      setNotice({ type: "error", text: "Choose a valid audio file (MP3, WAV, M4A, OGG, etc.)." }); return;
    }
    if (form.audio.size > 50 * 1024 * 1024) {
      setNotice({ type: "error", text: "Audio file must be 50 MB or smaller." }); return;
    }
    if (form.cover && (!form.cover.type.startsWith("image/") || form.cover.size > 8 * 1024 * 1024)) {
      setNotice({ type: "error", text: "Cover must be an image no larger than 8 MB." }); return;
    }
    const body = new FormData();
    body.append("title", form.title.trim()); body.append("artist", form.artist.trim());
    body.append("album", form.album.trim() || "Single"); body.append("genre", form.genre);
    body.append("audio", form.audio); if (form.cover) body.append("cover", form.cover);
    setBusy(true); setProgress(0);
    try {
      await api.post("/songs/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: event => { if (event.total) setProgress(Math.round(event.loaded * 100 / event.total)); }
      });
      setNotice({ type: "success", text: "Track uploaded to Cloudinary and added to your catalogue." });
      setForm(emptyForm); e.target.reset(); await load();
    } catch (error) {
      setNotice({ type: "error", text: error.response?.data?.message || "Upload failed. Check your connection and Cloudinary configuration." });
    } finally { setBusy(false); }
  }

  async function remove(song) {
    if (!window.confirm(`Remove “${song.title}” from the catalogue?`)) return;
    try {
      await api.delete(`/songs/${song._id}`);
      setNotice({ type: "success", text: "Track removed from catalogue." }); await load();
    } catch (error) { setNotice({ type: "error", text: error.response?.data?.message || "Could not remove track." }); }
  }

  const visibleSongs = songs.filter(song => `${song.title} ${song.artist} ${song.album || ""}`.toLowerCase().includes(filter.toLowerCase()));

  return <div className="page-content admin-page">
    <div className="admin-heading"><div><p className="eyebrow">SOUNDWAVE CONTROL ROOM</p><h1>Admin studio</h1><p>Upload releases, curate the catalogue and keep the music moving.</p></div><button className="icon-button refresh-button" onClick={load} title="Refresh catalogue"><RefreshCw size={18}/></button></div>
    <div className="admin-stats">
      <div className="stat-card"><span><Music2 size={18}/> CATALOGUE</span><strong>{stats.totalSongs}</strong><small>Tracks published</small></div>
      <div className="stat-card"><span><Activity size={18}/> LISTENING</span><strong>{stats.totalPlays.toLocaleString()}</strong><small>Total recorded plays</small></div>
      <div className="stat-card"><span><Disc3 size={18}/> LATEST DROP</span><strong>{songs[0]?.title || "—"}</strong><small>{songs[0]?.artist || "No releases yet"}</small></div>
    </div>
    <section className="admin-panel upload-panel">
      <div className="admin-section-title"><div><p className="eyebrow">PUBLISH A TRACK</p><h2>Music upload</h2></div><span className="secure-label">CLOUDINARY STORAGE</span></div>
      <form onSubmit={submit} className="upload-form">
        <label>Track title<input value={form.title} onChange={e => update("title", e.target.value)} maxLength="120" placeholder="e.g. Midnight City" required/></label>
        <label>Artist<input value={form.artist} onChange={e => update("artist", e.target.value)} maxLength="100" placeholder="Artist name" required/></label>
        <label>Album<input value={form.album} onChange={e => update("album", e.target.value)} maxLength="100" placeholder="Album or single"/></label>
        <label>Genre<select value={form.genre} onChange={e => update("genre", e.target.value)}>{["Pop","Hip-Hop","Electronic","Rock","R&B","Jazz","Classical","Indie","Other"].map(g => <option key={g}>{g}</option>)}</select></label>
        <label className="file-field"><span>Audio file <small>Required · max 50 MB</small></span><input type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg,.flac" onChange={e => update("audio", e.target.files?.[0] || null)} required/><small>{form.audio ? `${form.audio.name} · ${prettySize(form.audio.size)}` : "MP3, WAV, M4A, OGG and more"}</small></label>
        <label className="file-field"><span>Cover artwork <small>Optional · max 8 MB</small></span><input type="file" accept="image/*" onChange={e => update("cover", e.target.files?.[0] || null)}/><small>{form.cover ? form.cover.name : "JPG, PNG or WebP"}</small></label>
        <div className="upload-actions"><button className="primary-button" disabled={busy}><UploadCloud size={17}/>{busy ? `Uploading ${progress}%` : "Publish track"}</button><span>Audio is uploaded securely to your Cloudinary account.</span></div>
        {busy && <div className="upload-progress"><div style={{ width: `${progress}%` }}/></div>}
      </form>
      {notice.text && <div className={notice.type === "success" ? "success-message" : "notice"} role="status">{notice.text}</div>}
    </section>
    <section className="admin-panel catalogue-panel">
      <div className="admin-section-title"><div><p className="eyebrow">LIBRARY MANAGEMENT</p><h2>Catalogue <span>{songs.length}</span></h2></div><input className="catalogue-filter" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter tracks..."/></div>
      {loading ? <div className="empty-state">Loading catalogue…</div> : visibleSongs.length ? <div className="catalogue-table">
        {visibleSongs.map(song => <div className="catalogue-row" key={song._id}>
          <img src={song.coverUrl || "https://placehold.co/64x64/20242e/ffffff?text=SW"} alt=""/>
          <div className="catalogue-track"><strong>{song.title}</strong><small>{song.artist} · {song.album || "Single"}</small></div>
          <span className="catalogue-genre">{song.genre || "Other"}</span><span className="catalogue-plays">{(song.plays || 0).toLocaleString()} plays</span>
          <button className="icon-button danger" onClick={() => remove(song)} aria-label={`Delete ${song.title}`} title="Remove track"><Trash2 size={17}/></button>
        </div>)}
      </div> : <div className="empty-state"><Music2 size={28}/><h3>{songs.length ? "No matching tracks" : "Your catalogue is waiting"}</h3><p>{songs.length ? "Try another search." : "Publish your first track using the upload form above."}</p></div>}
    </section>
  </div>;
}
