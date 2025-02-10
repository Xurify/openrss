import { JSDOM } from "jsdom";
import { RssFeed } from "@/types/rss";
import { parseRssFeed } from "@/utils/rss";

const extractAndTruncateDescription = (html: string): string => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const firstParagraph = doc.querySelector("p");

  if (firstParagraph) {
    const textContent = firstParagraph.textContent?.trim() ?? "";
    const words = textContent.split(" ");
    const truncated = words.slice(0, 25).join(" ");
    return truncated + (words.length > 25 ? "..." : "");
  }

  return "";
};

export const parseRssFeedOnServer = async (
  xmlText: string,
  feedUrl: string
): Promise<RssFeed> => {
  const parsedFeed = await parseRssFeed(
    xmlText,
    feedUrl,
    extractAndTruncateDescription
  );
  return parsedFeed;
};
