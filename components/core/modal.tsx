import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/core/button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void | Promise<void>;
  variant?: 'default' | 'destructive';
}

export const Modal = ({ 
  open, 
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  actionText = "Confirm",
  onAction,
  variant = 'default'
}: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onOpenChange(false);
    }, 200);
  };

  const handleAction = async () => {
    if (onAction) {
      await onAction();
    }
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-200 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      <div 
        className={`relative w-full sm:max-w-lg bg-white dark:bg-neutral-800 rounded-lg shadow-lg transform transition-all duration-200 scale-95 opacity-0 ${
          isAnimating ? 'scale-100 opacity-100' : ''
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={handleAction}
          >
            {actionText}
          </Button>
        </div>
      </div>
    </div>
  );
};
