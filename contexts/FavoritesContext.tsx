"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (guid: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (guid: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(guid)
        ? prevFavorites.filter((id) => id !== guid)
        : [...prevFavorites, guid];
      
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 