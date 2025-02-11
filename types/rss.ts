import { z } from "zod";

export const RssItemSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  pubDate: z.string(),
  guid: z.string(),
  imageUrl: z.string().optional(),
  channelTitle: z.string().optional(),
  url: z.string().optional(),
  feedUrl: z.string(),
});

export type RssItem = z.infer<typeof RssItemSchema>;

export const RssFeedSchema = z.object({
  items: z.array(RssItemSchema),
});

export type RssFeed = z.infer<typeof RssFeedSchema>; 