"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { getFeeds, addFeeds as dbAddFeeds, getFavorites, toggleFavorite as dbToggleFavorite } from '@/utils/db';
import type { RssItem } from "@/types/rss";

interface StoreContextType {
  feeds: RssItem[];
  favorites: string[];
  addFeeds: (newFeeds: RssItem[]) => Promise<void>;
  toggleFavorite: (guid: string) => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [feeds, setFeeds] = useState<RssItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeeds().then(setFeeds);
    getFavorites().then(favs => setFavorites(favs.map(f => f.guid)));
    setIsLoading(false);
  }, []);

  const addFeeds = async (newFeeds: RssItem[]) => {
    await dbAddFeeds(newFeeds);
    setFeeds(await getFeeds());
  };

  const toggleFavorite = async (guid: string) => {
    await dbToggleFavorite(guid);
    setFavorites(await getFavorites().then(favs => favs.map(f => f.guid)));
  };

  return (
    <StoreContext.Provider value={{ feeds, favorites, addFeeds, toggleFavorite, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
} 