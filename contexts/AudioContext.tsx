"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AudioMetadata {
  title: string;
  channelTitle?: string;
  imageUrl?: string;
  guid: string;
  url: string;
}

interface AudioContextType {
  episodeUrl: string;
  metadata: AudioMetadata | null;
  setCurrentEpisode: (metadata: AudioMetadata) => void;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [episodeUrl, setEpisodeUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const { duration, currentTime, isPlaying, togglePlay, seek, setVolume } = useAudioPlayer(episodeUrl);

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
    togglePlay,
    seek,
    setVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 