import {
  HomeIcon,
  DownloadIcon,
  SettingsIcon,
  HeartIcon,
} from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="border-r-2 border-black p-2 w-24 h-full flex flex-col">
      <div className="flex flex-col items-center space-y-8 flex-1 pt-8">
        <button className="flex flex-col items-center gap-1 p-3 hover:text-theme-main rounded-lg transition-colors">
          <HomeIcon size={28} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-3 hover:text-theme-main rounded-lg transition-colors">
          <HeartIcon size={28} />
          <span className="text-xs font-medium">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-3 hover:text-theme-main rounded-lg transition-colors">
          <DownloadIcon size={28} />
          <span className="text-xs font-medium">Downloads</span>
        </button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <button className="flex flex-col items-center gap-1 p-3 hover:text-theme-main rounded-lg transition-colors">
          <SettingsIcon size={28} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
