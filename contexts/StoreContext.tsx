"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { z } from 'zod';
import type { RssItem } from "@/types/rss";

const RssItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  pubDate: z.string(),
  guid: z.string(),
  imageUrl: z.string().optional(),
  channelTitle: z.string().optional(),
  enclosureUrl: z.string().optional(),
});

interface StoreContextType {
  feeds: RssItem[];
  favorites: string[];
  addFeeds: (newFeeds: RssItem[]) => void;
  toggleFavorite: (guid: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [feeds, setFeeds] = useState<RssItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFeeds = localStorage.getItem("rssFeeds");
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFeeds) {
      try {
        const parsedFeeds = JSON.parse(storedFeeds);
        setFeeds(parsedFeeds.items);
      } catch (error) {
        console.error("Failed to load stored feeds:", error);
      }
    }

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Failed to load stored favorites:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (feeds.length > 0) {
      localStorage.setItem("rssFeeds", JSON.stringify({ items: feeds }));
    }
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFeeds = (newFeeds: RssItem[]) => {
    setFeeds(prevFeeds => {
      const uniqueNewFeeds = newFeeds.filter(
        newFeed => !prevFeeds.some(existingFeed => existingFeed.link === newFeed.link)
      );
      return [...prevFeeds, ...uniqueNewFeeds];
    });
  };

  const toggleFavorite = (guid: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(guid)
        ? prevFavorites.filter(id => id !== guid)
        : [...prevFavorites, guid];
      return newFavorites;
    });
  };

  return (
    <StoreContext.Provider value={{ feeds, favorites, addFeeds, toggleFavorite }}>
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