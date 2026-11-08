import { useEffect } from "react";
import { Disc3, Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function formatTime(value = 0) {
  if (!Number.isFinite(value)) return "0:00";
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function Player() {
  const {
    audioRef, currentSong, isPlaying, setIsPlaying, currentTime, setCurrentTime,
    duration, setDuration, volume, setVolume, togglePlay, nextSong, previousSong
  } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [currentSong, isPlaying, audioRef, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, audioRef]);

  if (!currentSong) return <footer className="player empty-player">
    <Disc3 size={20}/><span>Choose a track to start listening</span>
  </footer>;

  return <footer className="player">
    <audio
      ref={audioRef}
      src={currentSong.audioUrl}
      onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
      onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
      onEnded={nextSong}
    />
    <div className="now-playing">
      <img src={currentSong.coverUrl || "https://placehold.co/64x64/20242e/ffffff?text=SW"} alt="" />
      <div className="track-meta"><strong>{currentSong.title}</strong><span>{currentSong.artist}</span></div>
      <Heart size={17} className="muted-icon"/>
    </div>
    <div className="playback">
      <div className="player-controls">
        <button className="icon-button" onClick={previousSong} aria-label="Previous"><SkipBack size={18}/></button>
        <button className="play-button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
        </button>
        <button className="icon-button" onClick={nextSong} aria-label="Next"><SkipForward size={18}/></button>
      </div>
      <div className="progress-row">
        <span>{formatTime(currentTime)}</span>
        <input aria-label="Seek" type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)}
          onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }}/>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
    <div className="volume-control"><Volume2 size={18}/><input aria-label="Volume" type="range" min="0" max="1" step="0.01"
      value={volume} onChange={e => setVolume(Number(e.target.value))}/></div>
  </footer>;
}
