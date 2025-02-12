import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const isLastYear = date.getFullYear() < now.getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: isLastYear ? "numeric" : undefined,
  };

  return date.toLocaleDateString(undefined, options);
};

type Options = {
  maxLength: number;
  ellipsis?: string;
  preserveWords?: boolean;
};

export const truncate = (
  text: string,
  options: Options = { maxLength: 50, ellipsis: "...", preserveWords: false }
): string => {
  const { maxLength, ellipsis = "...", preserveWords = true } = options;

  if (maxLength < 1) throw new Error("maxLength must be positive");
  if (text.length <= maxLength) return text;

  const truncateAt = maxLength - ellipsis.length;
  let result = preserveWords
    ? text.slice(0, text.lastIndexOf(" ", truncateAt))
    : text.slice(0, truncateAt);

  return result + ellipsis;
};
