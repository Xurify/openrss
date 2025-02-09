"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AudioMetadata {
  title: string;
  channelTitle?: string;
  imageUrl?: string;
  guid: string;
}

interface AudioContextType {
  audioUrl: string;
  metadata: AudioMetadata | null;
  setAudioUrl: (url: string, metadata: AudioMetadata) => void;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioUrl, setAudioUrlState] = useState<string>('');
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const { duration, currentTime, isPlaying, togglePlay, seek, setVolume } = useAudioPlayer(audioUrl);

  const setAudioUrl = (url: string, newMetadata: AudioMetadata) => {
    setAudioUrlState(url);
    setMetadata(newMetadata);
  };

  const value = {
    audioUrl,
    metadata,
    setAudioUrl,
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