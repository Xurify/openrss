import { useState, useEffect, useRef } from "react";

export const useAudioPlayer = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.remove();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    //audio.pause();

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value / 100;
  };

  return {
    audioRef,
    duration,
    currentTime,
    isPlaying,
    togglePlay,
    seek,
    setVolume,
    pause,
  };
};
