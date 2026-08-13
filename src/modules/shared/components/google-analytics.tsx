import { GoogleAnalytics } from "@next/third-parties/google";

type GoogleAnalyticsProps = {
  gaId: string;
};

export function GoogleAnalyticsProvider({
  gaId,
}: GoogleAnalyticsProps) {
  return <GoogleAnalytics gaId={gaId} />;
}   