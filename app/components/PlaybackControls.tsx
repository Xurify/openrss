import { Slider } from "@/components/ui/slider";
import {
  HeartIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwSquareIcon,
  RotateCwSquareIcon,
  Rows3Icon,
  SkipForwardIcon,
  Volume2Icon,
} from "lucide-react";

export const PlaybackControls = () => {
  return (
    <div className="flex items-center bg-[#F4722F] border-2 border-black p-2 w-full h-24 mt-auto">
      <div className="flex items-center space-x-3 w-1/3">
        <div className="h-20 w-20 mr-4 bg-white border-2 border-black"></div>
        <div>
          <h1 className="text-2xl font-bold">Name</h1>
          <p className="text-sm">Title</p>
        </div>
        <div>
          <HeartIcon size={25} />
        </div>
      </div>
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <RotateCcwSquareIcon size={45} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold mt-1.5">
              15
            </span>
          </div>
          <div className="flex items-center justify-center bg-white/40 h-14 w-14 p-2 rounded-full">
            <PauseIcon size={35} stroke={undefined} fill="#FFF" />
          </div>
          <div className="relative">
            <RotateCwSquareIcon size={45} />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold mt-1.5">
              15
            </span>
          </div>
          <div>
            <SkipForwardIcon size={25} />
          </div>
        </div>
        <div className="mt-3 max-w-[500px] w-full">
          <Slider className="w-full" defaultValue={[0]} max={100} step={1} />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-3 w-1/3">
        <div>
          <Rows3Icon size={25} />
        </div>
        <div>
          <Volume2Icon size={25} />
        </div>
        <Slider
          className="max-w-[100px]"
          defaultValue={[0]}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};
