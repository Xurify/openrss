import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenRSS",
    short_name: "OpenRSS",
    description: "RSS-based audio player",
    start_url: "/",
    display: "standalone",
    background_color: "#FFEFD6",
    theme_color: "#F4702F",
    icons: [
      {
        src: "/images/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/images/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/images/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
