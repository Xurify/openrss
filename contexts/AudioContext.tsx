"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { LOCAL_STORAGE_LAST_PLAYED_KEY } from "./StoreContext";

interface AudioMetadata {
  title: string;
  channelTitle?: string;
  imageUrl?: string;
  guid: string;
  url: string;
  lastPosition?: number;
}

interface AudioContextType {
  episodeUrl: string;
  metadata: AudioMetadata | null;
  setCurrentEpisode: (metadata: AudioMetadata) => void;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [episodeUrl, setEpisodeUrl] = useState<string>("");
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const { duration, currentTime, isPlaying, togglePlay, seek, setVolume, pause, play } =
    useAudioPlayer(episodeUrl);

  useEffect(() => {
    const lastPlayed = localStorage.getItem(LOCAL_STORAGE_LAST_PLAYED_KEY);
    if (lastPlayed) {
      const savedMetadata = JSON.parse(lastPlayed) as AudioMetadata;
      setEpisodeUrl(savedMetadata.url);
      setMetadata(savedMetadata);
      if (savedMetadata.lastPosition) {
        setTimeout(() => {
          savedMetadata.lastPosition && seek(savedMetadata.lastPosition);
          pause();
        }, 0);
      }
    }
  }, []);

  const saveCurrentState = () => {
    if (metadata && currentTime > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_LAST_PLAYED_KEY,
        JSON.stringify({
          ...metadata,
          lastPosition: currentTime,
        })
      );
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", saveCurrentState);
    return () => window.removeEventListener("beforeunload", saveCurrentState);
  }, [metadata, currentTime]);

  const handleTogglePlay = () => {
    togglePlay();
    saveCurrentState();
  };

  const setCurrentEpisode = (newMetadata: AudioMetadata) => {
    setEpisodeUrl(newMetadata.url);
    setMetadata(newMetadata);
  };

  const value = {
    episodeUrl,
    metadata,
    setCurrentEpisode,
    duration,
    currentTime,
    isPlaying,
    togglePlay: handleTogglePlay,
    seek,
    play,
    pause,
    setVolume,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
