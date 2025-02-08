"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Slider } from "@/components/ui/slider";
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
import { useState } from "react";

const AUDIO_URL =
  "https://www.buzzsprout.com/2260539/episodes/16398459-seven-shipping-principles.mp3";

export const PlaybackControls = () => {
  const { duration, currentTime, isPlaying, togglePlay, seek, setVolume } =
    useAudioPlayer(AUDIO_URL);
  const [volume, setVolumeState] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    const roundedSeconds = Math.round(seconds);
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const remainingSeconds = roundedSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => togglePlay();
  const handleSkipForward = () => seek(duration);
  const handleRewind15 = () => seek(Math.max(0, currentTime - 15));
  const handleForward15 = () => seek(Math.min(duration, currentTime + 15));

  const handleVolumeChange = (value: number[]) => {
    setVolumeState(value);
    setVolume(isMuted ? 0 : value[0]);
    if (value[0] > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? volume[0] : 0);
  };

  const VolumeIconComponent = () => {
    if (isMuted || volume[0] === 0) return <VolumeXIcon size={25} />;
    if (volume[0] < 33) return <VolumeIcon size={25} />;
    if (volume[0] < 66) return <Volume1Icon size={25} />;
    return <Volume2Icon size={25} />;
  };

  const handleProgressChange = (value: number[]) => {
    seek(value[0]);
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="flex items-center bg-[#F4722F] border-2 border-black p-2 w-full h-24 mt-auto">
      <div className="flex items-center space-x-3 w-1/3">
        <div className="h-20 w-20 mr-4 bg-white border-2 border-black"></div>
        <div>
          <h1 className="text-2xl font-bold">Name</h1>
          <p className="text-sm">Title</p>
        </div>
        <button className="text-black hover:text-black/60 transition-colors">
          <HeartIcon size={25} />
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
          <Slider
            className="w-full cursor-pointer"
            value={[currentTime]}
            onValueChange={handleProgressChange}
            max={duration}
            step={1}
          />
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
          className="max-w-[100px] cursor-pointer"
          value={volume}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};
