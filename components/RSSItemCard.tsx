import React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/core/card";
import { Button } from "@/components/core/button";
import { HeartIcon, DownloadIcon } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils/strings";
import { type RssItem } from "@/types/rss";
import { useAudio } from "@/contexts/AudioContext";
import { useStore } from "@/contexts/StoreContext";

interface RssItemCardProps {
  item: RssItem;
  isFavorite: boolean;
  toggleFavorite: (guid: string) => Promise<void>;
}

export const RssItemCard: React.FC<RssItemCardProps> = ({
  item,
  toggleFavorite,
  isFavorite,
}) => {
  const { setCurrentEpisode } = useAudio();
  const { updateEpisodeDownloadedStatus } = useStore();

  const handlePlayNow = (item: RssItem) => {
    if (item.url) {
      setCurrentEpisode({
        url: item.url,
        title: item.title,
        channelTitle: item.channelTitle,
        imageUrl: item.imageUrl,
        guid: item.guid,
      });
    }
  };

  const handleDownload = (item: RssItem) => {
    updateEpisodeDownloadedStatus(item.guid, !item.downloaded);
  };

  return (
    <div className="flex flex-col border-b border-black bg-transparent">
      <CardContent className="flex p-2">
        {item.imageUrl && (
          <div className="flex-shrink-0 mr-4">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="rounded-md w-[100px] h-[100px] object-cover"
              width={100}
              height={100}
            />
          </div>
        )}
        <div>
          <CardTitle>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.channelTitle && (
                <span className="block text-sm font-normal text-gray-500">
                  {item.channelTitle}
                </span>
              )}
              {truncate(item.title)}
            </a>
          </CardTitle>
          <CardDescription>{formatDate(item.pubDate)}</CardDescription>
          <p className="mt-2 text-sm text-gray-600">{item.description}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-0 flex flex-col items-center">
        <Button
          variant="default"
          className="w-full p-6"
          onClick={() => handlePlayNow(item)}
        >
          Listen Now
        </Button>
        <div className="flex space-x-2 w-full">
          <Button
            variant="transparent"
            className="flex-1 h-12"
            onClick={() => toggleFavorite(item.guid)}
          >
            <HeartIcon
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-black" : "text-black"
              }`}
            />
            {isFavorite ? "Unfavorite" : "Favorite"}
          </Button>
          {item.url && (
            <Button
              variant="transparent"
              className="flex-1 h-12"
              onClick={() => handleDownload(item)}
            >
              <DownloadIcon
                className={
                  item.downloaded ? "h-4 w-4 text-green-500" : "h-4 w-4"
                }
              />
              {item.downloaded ? "Downloaded" : "Download"}
            </Button>
          )}
        </div>
      </CardFooter>
    </div>
  );
};
