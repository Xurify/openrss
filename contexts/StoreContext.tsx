"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  getEpisodes,
  addEpisodes as dbAddEpisodes,
  getFavorites,
  toggleFavorite as dbToggleFavorite,
  deleteEpisodes as clearEpisodesFromDb,
  deleteAllFavorites as clearFavoritesFromDb,
  updateEpisodeDownloadedStatus as dbUpdateEpisodeDownloadedStatus,
} from "@/lib/utils/db";
import type { RssItem } from "@/types/rss";

interface StoreContextType {
  episodes: RssItem[];
  favorites: string[];
  addEpisodes: (newEpisodes: RssItem[]) => Promise<void>;
  deleteEpisodes: (removeAll?: boolean) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
  getLatestEpisodes: () => RssItem[];
  toggleFavorite: (guid: string) => Promise<void>;
  isLoading: boolean;
  updateEpisodeDownloadedStatus: (guid: string, downloaded: boolean) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [episodes, setEpisodes] = useState<RssItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEpisodes().then(setEpisodes);
    getFavorites().then((favs) => setFavorites(favs.map((f) => f.guid)));
    setIsLoading(false);
  }, []);

  const addEpisodes = async (newEpisodes: RssItem[]) => {
    await dbAddEpisodes(newEpisodes);
    setEpisodes(await getEpisodes());
  };

  const toggleFavorite = async (guid: string) => {
    await dbToggleFavorite(guid);
    setFavorites(await getFavorites().then((favs) => favs.map((f) => f.guid)));
  };

  const deleteEpisodes = async (removeAll: boolean = false) => {
    await clearEpisodesFromDb(removeAll);
    if (removeAll) {
      setEpisodes([]);
      setFavorites([]);
    } else {
      const newEpisodes = await getEpisodes();
      setEpisodes(newEpisodes);
    }
  };

  const clearAllFavorites = async () => {
    await clearFavoritesFromDb();
    setFavorites([]);
  };

  const getLatestEpisodes = () => {
    return [...episodes].sort((a, b) => {
      const dateA = new Date(a.pubDate);
      const dateB = new Date(b.pubDate);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const updateEpisodeDownloadedStatus = async (guid: string, downloaded: boolean) => {
    await dbUpdateEpisodeDownloadedStatus(guid, downloaded);
    fetchEpisodes();
  };

  const fetchEpisodes = async () => {
    setEpisodes(await getEpisodes());
  };

  const value: StoreContextType = {
    episodes,
    favorites,
    addEpisodes,
    deleteEpisodes,
    clearAllFavorites,
    getLatestEpisodes,
    toggleFavorite,
    isLoading,
    updateEpisodeDownloadedStatus,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
