"use client";

import { useState } from "react";
import { Button } from "@/components/core/button";
import { Input } from "@/components/core/input";
import { SearchIcon, Loader2 } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { RssItemCard } from "@/components/RSSItemCard";
//import { parseRssFeed } from "@/utils/rss";

export default function Home() {
  const [importFeedUrl, setImportFeedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addFeeds, favorites, toggleFavorite, getLatestFeeds } = useStore();


  const feeds = getLatestFeeds();

  // const handleImport = async () => {
  //   try {
  //     const response = await fetch(importFeedUrl);

  //     const data = await response.text();
  //     const parsedFeed = await parseRssFeed(data, importFeedUrl);

  //     if (parsedFeed.items.length > 0) {
  //       addFeeds(parsedFeed.items);
  //     } else {
  //       alert("No new items found in this feed");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or parsing RSS feed:", error);
  //   }
  // };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rss-parser?url=${importFeedUrl}`);
      const data = await response.json();
      const parsedEpisodes = data.data.items || [];
      if (parsedEpisodes.length > 0) {
        addFeeds(parsedEpisodes);
        setIsLoading(false);
      } else {
        console.log("No new items found in this feed");
      }

    } catch (error) {
      console.error("Error fetching or parsing RSS feed:", error);
    }
  };

  const handleChangeImportFeedUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportFeedUrl(e.target.value);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Import RSS Feed</h1>
      <div className="relative bg-white/80">
        <Input
          className="rounded-none p-6 pl-10 border-black"
          value={importFeedUrl}
          onChange={handleChangeImportFeedUrl}
        />
        <SearchIcon
          size={20}
          className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-black"
        />
      </div>
      <Button className="mt-4 p-6" variant="default" onClick={handleImport} disabled={isLoading}>
        {isLoading ? "Importing..." : "Import"}
      </Button>
      {isLoading ? (
        // <div>Loading episodes...</div>
        <div className="w-full flex justify-center items-center mt-8">
          <Loader2 className="h-14 w-14 animate-spin text-black" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feeds.map((item) => (
            <RssItemCard
              key={item.guid}
              item={item}
              isFavorite={favorites.includes(item.guid)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
