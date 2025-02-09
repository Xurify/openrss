"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, DownloadIcon, HeartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useStore } from "@/contexts/StoreContext";
import { parseRssFeed, formatDate, truncateTitle } from "@/utils/rss";
import { RssItemSchema, type RssItem } from "@/types/rss";

const RssFeedSchema = z.object({
  items: z.array(RssItemSchema),
});

export default function Home() {
  const [url, setUrl] = useState("");
  const { feeds, addFeeds, favorites, toggleFavorite } = useStore();
  const { setAudioUrl } = useAudio();

  const handleImport = async () => {
    try {
      const response = await fetch(url);
      const data = await response.text();
      const parsedFeed = parseRssFeed(data);

      if (parsedFeed.items.length > 0) {
        addFeeds(parsedFeed.items);
      } else {
        alert("No new items found in this feed");
      }
    } catch (error) {
      console.error("Error fetching or parsing RSS feed:", error);
    }
  };

  const handlePlayNow = (item: RssItem) => {
    if (item.enclosureUrl) {
      setAudioUrl(item.enclosureUrl, {
        title: item.title,
        channelTitle: item.channelTitle,
        imageUrl: item.imageUrl,
        guid: item.guid,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Import RSS Feed</h1>
      <div className="relative bg-yellow-200">
        <Input
          className="rounded-none p-6 pl-10 border-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <SearchIcon
          size={20}
          className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-black"
        />
      </div>
      <button
        className="mt-4 bg-orange-500 hover:bg-orange-400 p-2 border border-black"
        onClick={handleImport}
      >
        Import
      </button>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {feeds.map((item, index) => (
          <div
            key={index}
            className="flex flex-col border-b border-black bg-transparent"
          >
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
                    {truncateTitle(item.title)}
                  </a>
                </CardTitle>
                <CardDescription>{formatDate(item.pubDate)}</CardDescription>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            </CardContent>
            <CardFooter className="mt-auto p-0 flex flex-col items-center">
              <Button
                variant="flat-orange"
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
                      favorites.includes(item.guid) ? "fill-red-500 text-black" : "text-black"
                    }`}
                  />
                  {favorites.includes(item.guid) ? "Unfavorite" : "Favorite"}
                </Button>
                {item.enclosureUrl && (
                  <Button
                    variant="transparent"
                    className="flex-1 h-12"
                    onClick={() => window.open(item.enclosureUrl, "_blank")}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        ))}
      </div>
    </div>
  );
}
