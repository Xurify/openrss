"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, DownloadIcon, HeartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DOMPurify from "dompurify";

const RssItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  pubDate: z.string(),
  guid: z.string(),
  imageUrl: z.string().optional(),
  channelTitle: z.string().optional(),
  enclosureUrl: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

type RssItem = z.infer<typeof RssItemSchema>;

const RssFeedSchema = z.object({
  items: z.array(RssItemSchema),
});

type RssFeed = z.infer<typeof RssFeedSchema>;

const extractAndTruncateDescription = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const firstParagraph = doc.querySelector("p");

  if (firstParagraph) {
    const textContent = firstParagraph.textContent?.trim() ?? "";
    const words = textContent.split(" ");
    const truncated = words.slice(0, 25).join(" ");
    return truncated + (words.length > 25 ? "..." : "");
  }

  return "";
};

const formatDate = (dateString: string): string => {
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

const truncateTitle = (title: string, maxLength: number = 50): string => {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

const parseRssFeed = (xmlText: string): RssFeed => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  console.log(xmlText);

  const channelTitle =
    xmlDoc.querySelector("channel > title")?.textContent ?? "";

  const items: RssItem[] = Array.from(xmlDoc.querySelectorAll("item")).map(
    (item) => {
      let imageUrl = "";

      // TODO: Find a better way to get the image url
      const enclosure = item.querySelector("enclosure");
      if (enclosure && enclosure.getAttribute("type")?.startsWith("image")) {
        imageUrl = enclosure.getAttribute("url") ?? "";
      }

      const mediaContent = item.querySelector("media\\:content");
      if (
        mediaContent &&
        mediaContent.getAttribute("type")?.startsWith("image")
      ) {
        imageUrl = mediaContent.getAttribute("url") ?? "";
      }

      const itemImage = item.querySelector("image");
      if (itemImage) {
        imageUrl = itemImage.querySelector("url")?.textContent ?? "";
      }

      if (!imageUrl) {
        const channelImage = xmlDoc.querySelector("channel > image");
        if (channelImage) {
          imageUrl = channelImage.querySelector("url")?.textContent ?? "";
        }
      }
      const rawDescription =
        item.querySelector("description")?.textContent ?? "";
      const processedDescription =
        extractAndTruncateDescription(rawDescription);
      const episodeTitle = item.querySelector("title")?.textContent ?? "";

      const enclosureUrl =
        item.querySelector("enclosure")?.getAttribute("url") ?? "";

      return {
        title: episodeTitle,
        link: item.querySelector("link")?.textContent ?? "",
        description: processedDescription,
        pubDate: item.querySelector("pubDate")?.textContent ?? "",
        guid: item.querySelector("guid")?.textContent ?? "",
        imageUrl,
        channelTitle,
        enclosureUrl,
        isFavorite: false,
      };
    }
  );

  return { items };
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [feeds, setFeeds] = useState<RssFeed>({ items: [] });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFeeds = localStorage.getItem("rssFeeds");
    if (storedFeeds) {
      try {
        const parsedFeeds = RssFeedSchema.parse(JSON.parse(storedFeeds));
        setFeeds(parsedFeeds);
      } catch (error) {
        console.error("Failed to load or validate stored feeds:", error);
      }
    }
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    if (feeds.items.length > 0) {
      localStorage.setItem("rssFeeds", JSON.stringify(feeds));
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [feeds, favorites]);

  const handleImport = async () => {
    try {
      const response = await fetch(url);
      const data = await response.text();
      const parsedFeed = parseRssFeed(data);

      const newItems = parsedFeed.items.filter(
        (newItem) =>
          !feeds.items.some(
            (existingItem) => existingItem.link === newItem.link
          )
      );

      console.log(parsedFeed);

      if (newItems.length > 0) {
        setFeeds((prevFeeds) => ({
          items: [...prevFeeds.items, ...newItems],
        }));
      } else {
        alert("No new items found in this feed");
      }
    } catch (error) {
      console.error("Error fetching or parsing RSS feed:", error);
    }
  };

  const toggleFavorite = (guid: string) => {
    setFavorites((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites.includes(guid);
      if (isCurrentlyFavorite) {
        return prevFavorites.filter((id) => id !== guid);
      } else {
        return [...prevFavorites, guid];
      }
    });
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold">Import RSS Feed</h1>
      <div className="relative bg-yellow-200">
        <Input
          className="rounded-none p-6 pl-10 border-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <SearchIcon
          size={20}
          className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 text-black"
        />
      </div>
      <button
        className="mt-4 bg-orange-500 hover:bg-orange-400 p-2 border border-black"
        onClick={handleImport}
      >
        Import
      </button>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {feeds.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col border-b border-black bg-transparent"
          >
            <CardContent className="flex p-2">
              {item.imageUrl && (
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="rounded-md w-[100px] h-[100px] object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <div>
                <CardTitle>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.channelTitle && (
                      <span className="block text-sm font-normal text-gray-500">
                        {item.channelTitle}
                      </span>
                    )}
                    {truncateTitle(item.title)}
                  </a>
                </CardTitle>
                <CardDescription>{formatDate(item.pubDate)}</CardDescription>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            </CardContent>
            <CardFooter className="mt-auto p-0 flex flex-col items-center">
              <Button
                variant="flat-orange"
                className="w-full p-6"
                onClick={() => window.open(item.link, "_blank")}
              >
                Listen Now
              </Button>
              <div className="flex space-x-2 w-full">
                <Button
                  variant="transparent"
                  className="flex-1 h-12"
                  onClick={() => toggleFavorite(item.guid)}
                >
                  <HeartIcon
                    className={`h-4 w-4 ${
                      favorites.includes(item.guid) ? "text-red-500" : ""
                    }`}
                  />
                  {favorites.includes(item.guid) ? "Unfavorite" : "Favorite"}
                </Button>
                {item.enclosureUrl && (
                  <Button
                    variant="transparent"
                    className="flex-1 h-12"
                    onClick={() => window.open(item.enclosureUrl, "_blank")}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </CardFooter>
          </div>
        ))}
      </div>
    </div>
  );
}
