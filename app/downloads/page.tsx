"use client";

import { useStore } from "@/contexts/StoreContext";
import { RssItemCard } from "@/components/RSSItemCard";
import { type RssItem } from "@/types/rss";

export default function DownloadsPage() {
  const { episodes, favorites, toggleFavorite } = useStore();

  const downloadedEpisodes = episodes.filter(item => item.downloaded);

  if (downloadedEpisodes.length === 0) {
    return (
      <div className="flex flex-col h-full w-full p-4">
        <h1 className="text-2xl font-semibold">Downloads</h1>
        <p>No downloaded episodes available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Downloads</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {downloadedEpisodes.map((item: RssItem) => (
          <RssItemCard
            key={item.guid}
            item={item}
            isFavorite={favorites.includes(item.guid)}
          />
        ))}
      </div>
    </div>
  );
}
