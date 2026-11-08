import { createContext, useContext, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  function playSong(song, songs = queue) {
    setQueue(songs.length ? songs : [song]);
    setCurrentSong(song);
    setIsPlaying(true);
  }

  function togglePlay() {
    if (!currentSong) return;
    setIsPlaying(value => !value);
  }

  function nextSong() {
    if (!queue.length || !currentSong) return;
    const index = queue.findIndex(song => song._id === currentSong._id);
    setCurrentSong(queue[(index + 1) % queue.length]);
    setIsPlaying(true);
  }

  function previousSong() {
    if (!queue.length || !currentSong) return;
    const index = queue.findIndex(song => song._id === currentSong._id);
    setCurrentSong(queue[(index - 1 + queue.length) % queue.length]);
    setIsPlaying(true);
  }

  return <PlayerContext.Provider value={{
    audioRef, currentSong, queue, isPlaying, setIsPlaying, currentTime,
    setCurrentTime, duration, setDuration, volume, setVolume,
    playSong, togglePlay, nextSong, previousSong
  }}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
