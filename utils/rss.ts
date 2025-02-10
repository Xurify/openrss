import Parser from 'rss-parser';
import { RssFeed, RssItem } from "@/types/rss";

export const extractAndTruncateDescription = (html: string): string => {
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

export const truncateTitle = (title: string, maxLength: number = 50): string => {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

export const parseRssFeed = async (xmlText: string, feedUrl: string): Promise<RssFeed> => {
  const parser = new Parser();

  try {
    const feed = await parser.parseString(xmlText);

    console.log('feed3', feed);


    const channelTitle = feed.title ?? "";

    const items: RssItem[] = feed.items.map((item) => {
      let imageUrl = "";

      if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith("image")) {
        imageUrl = item.enclosure.url ?? "";
      }

      if (item['media:content'] && Array.isArray(item['media:content']) && item['media:content'].length > 0 && item['media:content'][0].$.url && item['media:content'][0].$.type && item['media:content'][0].$.type.startsWith("image")) {
        imageUrl = item['media:content'][0].$.url ?? "";
      }

      if (!imageUrl && item.image) {
        imageUrl = item.image;
      }

      if (!imageUrl && feed.image && feed.image.url) {
        imageUrl = feed.image.url;
      }

      const rawDescription = item.description ?? item.content ?? "";
      const processedDescription = extractAndTruncateDescription(rawDescription);
      const episodeTitle = item.title ?? "";
      const link = item.link ?? "";
      const pubDate = item.pubDate ?? "";
      const guid = item.guid ?? link;
      const enclosureUrl = item.enclosure?.url ?? "";

      return {
        title: episodeTitle,
        link: link,
        description: processedDescription,
        pubDate: pubDate,
        guid: guid,
        imageUrl,
        channelTitle,
        enclosureUrl,
        feedUrl,
      };
    });

    return { items };

  } catch (error) {
    console.error("Error parsing RSS feed with rss-parser:", error);
    return { items: [] };
  }
}; 