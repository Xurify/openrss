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

export const metadata: Metadata = {
  title: "OpenRSS",
  description: "RSS-based audio player",
  applicationName: "OpenRSS",
  appleWebApp: {
    capable: true,
    title: "OpenRSS",
    statusBarStyle: "black-translucent",
  },
  //authors: [{ name: "Xurify", url: "https://openrss.app" }],
  creator: "Xurify",
  icons: {
    icon: "/icon-192x192.png",
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
              <div className="flex flex-1 flex-col p-6">
                {children}
                <PlaybackControls />
              </div>
            </div>
          </AudioProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
