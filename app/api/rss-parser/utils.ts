//import { JSDOM } from "jsdom";
import { RssFeed } from "@/types/rss";
import { parseRssFeed } from "@/utils/rss";

const extractAndTruncateDescription = (html: string): string => {
  console.log(html);
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
