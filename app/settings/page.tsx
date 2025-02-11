"use client";

import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";

export default function SettingsPage() {
  const { deleteEpisodes } = useStore();
  const [open, setOpen] = useState(false);
  const [deleteFavorites, setDeleteFavorites] = useState(false);

  const handleClearStorage = async () => {
    await deleteEpisodes(deleteFavorites);
    setOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete All Imported Feeds
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm Feed Clearing"
        description="Are you sure you want to clear all imported RSS feeds? This action cannot be undone."
        cancelText="Cancel"
        actionText="Delete Feeds"
        onAction={handleClearStorage}
        variant="destructive"
      >
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
      </Modal>
    </div>
  );
}
