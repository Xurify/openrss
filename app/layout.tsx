import type { Metadata, Viewport } from "next";
import { Chivo_Mono } from "next/font/google";
import { PlaybackControls } from "@/components/PlaybackControls";
import { Sidebar } from "@/components/Sidebar";
import { AudioProvider } from "@/contexts/AudioContext";
import { StoreProvider } from "@/contexts/StoreContext";
import "./globals.css";

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-Mono",
  weight: "variable",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
});

const APP_NAME = "OpenRSS";
const APP_DESCRIPTION = "RSS-based audio player";
const APP_TITLE_TEMPLATE = "%s - OpenRSS";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://openrss.vercel.app",
    images: "/images/icon.svg",
  },
  metadataBase: new URL("https://openrss.vercel.app"),
  alternates: {
    canonical: "/",
  },
  referrer: "origin-when-cross-origin",
  keywords: ["RSS", "audio", "player", "podcast", "feed"],
  authors: [{ name: "Xurify", url: "https://openrss.vercel.app" }],
  creator: "Xurify",
  publisher: "Xurify",
  icons: {
    icon: "/images/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4702F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${chivoMono.className} antialiased`}>
        <StoreProvider>
          <AudioProvider>
            <div className="flex h-full">
              <Sidebar />
              <div className="flex flex-col flex-1">
                <div className="flex flex-1 flex-col overflow-y-auto scrollbar-gutter-stable">
                  {children}
                </div>
                <div className="p-6">
                  <PlaybackControls />
                </div>
              </div>
            </div>
          </AudioProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
