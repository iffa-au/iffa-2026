import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";

type GoogleAnalyticsProps = {
  gaId: string;
};
export const metadata: Metadata = {
  title: "IFFA Awards",
  verification: {
    google: "2f0R1wXJpnxzjUqfrLhTtZ27uJ_NOmUIEV4SPW-TlDA",
  },
};

export function GoogleAnalyticsProvider({
  gaId,
}: GoogleAnalyticsProps) {
  return <GoogleAnalytics gaId={gaId} />;
}   