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

export const parseRssFeed = (xmlText: string): RssFeed => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const channelTitle = xmlDoc.querySelector("channel > title")?.textContent ?? "";

  const items: RssItem[] = Array.from(xmlDoc.querySelectorAll("item")).map(
    (item) => {
      let imageUrl = "";

      const enclosure = item.querySelector("enclosure");
      if (enclosure && enclosure.getAttribute("type")?.startsWith("image")) {
        imageUrl = enclosure.getAttribute("url") ?? "";
      }

      const mediaContent = item.querySelector("media\\:content");
      if (mediaContent && mediaContent.getAttribute("type")?.startsWith("image")) {
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

      const rawDescription = item.querySelector("description")?.textContent ?? "";
      const processedDescription = extractAndTruncateDescription(rawDescription);
      const episodeTitle = item.querySelector("title")?.textContent ?? "";

      const enclosureUrl = item.querySelector("enclosure")?.getAttribute("url") ?? "";

      return {
        title: episodeTitle,
        link: item.querySelector("link")?.textContent ?? "",
        description: processedDescription,
        pubDate: item.querySelector("pubDate")?.textContent ?? "",
        guid: item.querySelector("guid")?.textContent ?? "",
        imageUrl,
        channelTitle,
        enclosureUrl,
      };
    }
  );

  return { items };
}; 