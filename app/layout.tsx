import type { Metadata } from "next";
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
  title: "OpenRRS",
  description: "RSS-based audio player",
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
