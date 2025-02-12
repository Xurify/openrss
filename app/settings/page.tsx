"use client";

import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";

interface ModalConfig {
  isOpen: boolean;
  title: string;
  description: string;
  action: (() => Promise<void>);
  showFavoritesCheckbox: boolean;
}

export default function SettingsPage() {
  const { deleteEpisodes, clearAllFavorites } = useStore();
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    description: "",
    action: async () => {},
    showFavoritesCheckbox: false
  });
  const [deleteFavorites, setDeleteFavorites] = useState(false);

  const handleClearStorage = async () => {
    await deleteEpisodes(deleteFavorites);
    closeModal();
  };

  const handleClearFavorites = async () => {
    await clearAllFavorites();
    closeModal();
  };

  const openModal = (type: string) => {
    const config = type === 'feeds' ? {
      title: "Confirm Feed Clearing",
      description: "Are you sure you want to clear all imported RSS feeds? This action cannot be undone.",
      action: handleClearStorage,
      showFavoritesCheckbox: true
    } : {
      title: "Confirm Favorites Clearing",
      description: "Are you sure you want to clear all favorites? This action cannot be undone.",
      action: handleClearFavorites,
      showFavoritesCheckbox: false
    };

    setModalConfig({
      isOpen: true,
      ...config
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
    setDeleteFavorites(false);
  };

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Button variant="destructive" onClick={() => openModal('feeds')}>
        Delete All Imported Feeds
      </Button>
      <Button variant="destructive" onClick={() => openModal('favorites')}>
        Delete All Favorites
      </Button>
      <Modal
        open={modalConfig.isOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={modalConfig.title}
        description={modalConfig.description}
        cancelText="Cancel"
        actionText={modalConfig.title.includes('Feed') ? "Delete Feeds" : "Delete Favorites"}
        onAction={modalConfig.action}
        variant="destructive"
      >
        {modalConfig.showFavoritesCheckbox && (
          <div className="flex flex-col gap-4">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-200 dark:bg-gray-800 dark:border-gray-700 ring-offset-white dark:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none"
                checked={deleteFavorites}
                onChange={(e) => setDeleteFavorites(e.target.checked)}
                id="delete-favorites"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Remove favorites
              </span>
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
}