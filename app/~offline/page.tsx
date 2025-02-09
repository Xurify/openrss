import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenRSS - Offline",
};

export default function Page() {
  return (
    <>
      <h1>This is the offline fallback page</h1>
      <h2>When offline, any page route will fallback to this page</h2>
    </>
  );
}
