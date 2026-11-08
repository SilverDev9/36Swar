import { Play } from "lucide-react";
import LikeButton from "./LikeButton";
import PlaylistAdd from "./PlaylistAdd";

export default function SongCard({ song, onPlay }) {
  return <article className="song-card">
    <div className="cover-wrap">
      <img src={song.coverUrl || "https://placehold.co/400x400/20242e/ffffff?text=SoundWave"} alt={`${song.title} cover`} />
      <button className="card-play" onClick={() => onPlay(song)} aria-label={`Play ${song.title}`}><Play fill="currentColor" size={19}/></button>
    </div>
    <div className="song-card-actions"><LikeButton songId={song._id}/><PlaylistAdd songId={song._id}/></div>
    <div className="song-card-title">{song.title}</div>
    <div className="song-card-subtitle">{song.artist}</div>
  </article>;
}
