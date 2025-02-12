import Parser from "rss-parser";
import { RssFeed, RssItem } from "@/types/rss";

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

export const parseRssFeed = async (
  xmlText: string,
  feedUrl: string,
  getDescription: (rawDescription: string) => string = extractAndTruncateDescription
): Promise<RssFeed> => {
  const parser = new Parser();

  try {
    const feed = await parser.parseString(xmlText);
    const channelTitle = feed.title ?? "";

    const items: RssItem[] = feed.items.map((item) => {
      let imageUrl = "";

      if (
        item.enclosure &&
        item.enclosure.type &&
        item.enclosure.type.startsWith("image")
      ) {
        imageUrl = item.enclosure.url ?? "";
      }

      if (
        item["media:content"] &&
        Array.isArray(item["media:content"]) &&
        item["media:content"].length > 0 &&
        item["media:content"][0].$.url &&
        item["media:content"][0].$.type &&
        item["media:content"][0].$.type.startsWith("image")
      ) {
        imageUrl = item["media:content"][0].$.url ?? "";
      }

      if (!imageUrl && item.image) {
        imageUrl = item.image;
      }

      if (!imageUrl && feed.image && feed.image.url) {
        imageUrl = feed.image.url;
      }

      const rawDescription = item.description ?? item.content ?? "";
      const processedDescription = getDescription(rawDescription);
      const episodeTitle = item.title ?? "";
      const link = item.link ?? "";
      const pubDate = item.pubDate ?? "";
      const guid = item.guid ?? link;
      const url = item.enclosure?.url ?? "";

      return {
        title: episodeTitle,
        link: link,
        description: processedDescription,
        pubDate: pubDate,
        guid: guid,
        imageUrl,
        channelTitle,
        url,
        feedUrl,
      };
    });

    return { items };
  } catch (error) {
    console.error("Error parsing RSS feed with rss-parser:", error);
    return { items: [] };
  }
};
