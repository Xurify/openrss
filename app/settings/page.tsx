"use client";

import { useState } from "react";
import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { useStore } from "@/contexts/StoreContext";

export default function SettingsPage() {
  const { clearFeeds } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Button 
        variant="destructive" 
        onClick={() => setOpen(true)}
      >
        Delete All Imported Feeds
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm Feed Clearing"
        description="Are you sure you want to clear all imported RSS feeds? This action cannot be undone."
        cancelText="Cancel"
        actionText="Delete Feeds"
        onAction={clearFeeds}
        variant="destructive"
      />
    </div>
  );
} 