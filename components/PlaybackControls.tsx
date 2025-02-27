"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";
import {
  LOCAL_STORAGE_LAST_PLAYED_KEY,
  useStore,
} from "@/contexts/StoreContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  HeartIcon,
  PauseIcon,
  PlayIcon,
  Rows3Icon,
  SkipForwardIcon,
  SkipBackIcon,
  Volume2Icon,
  RotateCcwIcon,
  RotateCwIcon,
  VolumeIcon,
  Volume1Icon,
  VolumeXIcon,
} from "lucide-react";
import { useEventListener } from "@/hooks/useEventListener";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const PlaybackControls = () => {
  const {
    duration,
    currentTime,
    isPlaying,
    togglePlay,
    seek,
    setVolume,
    metadata,
    setCurrentEpisode,
  } = useAudio();
  const { favorites, toggleFavorite } = useStore();
  const [volume, setVolumeState] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);

  // useEffect(() => {
  //   const lastPlayed = localStorage.getItem(LOCAL_STORAGE_LAST_PLAYED_KEY);
  //   if (lastPlayed) {
  //     const savedMetadata = JSON.parse(lastPlayed) as AudioMetadata;
  //     setEpisodeUrl(savedMetadata.url);
  //     setMetadata(savedMetadata);
  //     if (savedMetadata.lastPosition) {
  //       setTimeout(() => {
  //         savedMetadata.lastPosition && seek(savedMetadata.lastPosition);
  //         pause();
  //       }, 0);
  //     }
  //   }
  // }, []);

  const saveCurrentState = () => {
    if (metadata && currentTime > 0) {
      setCurrentEpisode({
        ...(metadata || {}),
        lastPosition: currentTime,
        //duration: duration,
      });

    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", saveCurrentState);
    return () => window.removeEventListener("beforeunload", saveCurrentState);
  }, [metadata, currentTime]);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const handlePlayPause = () => {
    togglePlay();
    saveCurrentState();
  };
  const handleSkipForward = () => seek(duration);
  const handleRewind15 = () => seek(Math.max(0, currentTime - 15));
  const handleForward15 = () => seek(Math.min(duration, currentTime + 15));

  const handleVolumeChange = (newVolume: number[]) => {
    setVolumeState(newVolume);
    setVolume(newVolume[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? volume[0] : 0);
  };

  const VolumeIconComponent = () => {
    if (isMuted || volume[0] === 0) return <VolumeXIcon />;
    if (volume[0] < 30) return <VolumeIcon />;
    if (volume[0] < 70) return <Volume1Icon />;
    return <Volume2Icon />;
  };

  const titleStyle = isPlaying
    ? "inline-block animate-marquee whitespace-nowrap"
    : "truncate";

  if (!metadata) return null;

  const isFavorite = favorites.includes(metadata.guid);

  return (
    <div className="flex items-center bg-theme-main border-2 border-black p-2 w-full h-24 mt-auto">
      <div className="flex items-center space-x-3 w-1/3">
        <div className="h-20 w-20 min-w-20 min-h-20 mr-4 bg-white border-2 border-black">
          {metadata.imageUrl && (
            <img
              src={metadata.imageUrl}
              alt={metadata.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="">
          <div
            className={
              "w-56 h-6 flex items-center overflow-hidden whitespace-nowrap"
            }
          >
            <p className={`text-sm font-bold ${titleStyle}`}>
              {metadata.title}
            </p>
          </div>
          <p className="text-sm truncate">{metadata.channelTitle}</p>
        </div>
        <button
          onClick={() => toggleFavorite(metadata.guid)}
          className="text-black hover:text-black/60 transition-colors"
        >
          <HeartIcon
            size={25}
            className={isFavorite ? "fill-red-500 text-black" : "text-black"}
          />
        </button>
      </div>
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleRewind15}
            className="relative text-black hover:text-black/60 transition-colors"
          >
            <RotateCcwIcon size={35} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mt-0.5">
              15
            </span>
          </button>
          <button
            onClick={handleSkipForward}
            className="text-black hover:text-black/60 transition-colors"
          >
            <SkipBackIcon size={25} />
          </button>
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center bg-white/25 h-14 w-14 p-2 rounded-full hover:bg-white/40 transition-colors duration-300"
          >
            {isPlaying ? (
              <PauseIcon size={32} stroke={undefined} fill="#FFF" />
            ) : (
              <PlayIcon size={32} stroke={undefined} fill="#FFF" />
            )}
          </button>
          <button
            onClick={handleSkipForward}
            className="text-black hover:text-black/60 transition-colors"
          >
            <SkipForwardIcon size={25} />
          </button>
          <button
            onClick={handleForward15}
            className="relative text-black hover:text-black/60 transition-colors"
          >
            <RotateCwIcon size={35} />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mt-0.5">
              15
            </span>
          </button>
        </div>
        <div className="mt-1 max-w-[500px] w-full flex items-center gap-2">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <div className="w-full ml-2">
            <Slider
              className="w-full"
              value={currentTime}
              onChange={(value) => seek(value as number)}
              max={duration}
              step={1}
              styles={{
                rail: { backgroundColor: "rgba(255, 255, 255, 0.25)" },
                track: { backgroundColor: "white" },
                handle: {
                  backgroundColor: "white",
                  border: "none",
                  boxShadow: "none",
                  opacity: 1,
                },
              }}
            />
          </div>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-3 w-1/3">
        <button className="text-black hover:text-black/60 transition-colors">
          <Rows3Icon size={25} />
        </button>
        <button
          onClick={toggleMute}
          className="text-black hover:text-black/60 transition-colors"
        >
          <VolumeIconComponent />
        </button>
        <Slider
          className="max-w-[100px]"
          value={volume[0]}
          onChange={(value) => handleVolumeChange([value as number])}
          max={100}
          step={1}
          styles={{
            rail: { backgroundColor: "rgba(255, 255, 255, 0.25)" },
            track: { backgroundColor: "white" },
            handle: {
              backgroundColor: "white",
              border: "none",
              boxShadow: "none",
              opacity: 1,
            },
          }}
        />
      </div>
    </div>
  );
};
