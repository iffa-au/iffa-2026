import type { Metadata } from "next";
import { GoogleAnalyticsProvider } from "@/components/GoogleAnalyticsProvider";

export const metadata: Metadata = {
  title: "IFFA Awards",
  verification: {
    google: "2f0R1wXJpnxzjUqfrLhTtZ27uJ_NOmUIEV4SPW-TlDA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <GoogleAnalyticsProvider
          gaId={process.env.NEXT_PUBLIC_GA_ID!}
        />
      </body>
    </html>
  );
}