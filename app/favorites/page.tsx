"use client";

import { useStore } from "@/contexts/StoreContext";
import { RssItemCard } from "@/components/RSSItemCard";
import { type RssItem } from "@/types/rss";

export default function FavoritesPage() {
  const { episodes, favorites } = useStore();

  const favoriteEpisodes = (episodes as RssItem[]).filter(item =>
    favorites.includes(item.guid)
  );

  if (favoriteEpisodes.length === 0) {
    return (
      <div className="flex flex-col h-full w-full p-4">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <p>No favorites found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {favoriteEpisodes.map((item: RssItem) => (
          <RssItemCard
            key={item.guid}
            item={item}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
