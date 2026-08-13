import type { Metadata } from "next";
import { Raleway, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GoogleAnalyticsProvider } from "@/modules/shared/components/google-analytics";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Referenced via inline `fontFamily` styles in a few premium/editorial
// sections (film submission form, synopsis page) — loaded globally here so
// those styles actually resolve to Playfair Display instead of silently
// falling back to Georgia.
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "IFFA Awards",
  description: "International Film Festival Awards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", raleway.variable, geistMono.variable, playfairDisplay.variable, "font-sans", "dark")}
    >
      <body className="min-h-full flex flex-col bg-[#0d0d0d] overflow-x-hidden">
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalyticsProvider
            gaId={process.env.NEXT_PUBLIC_GA_ID}
          />
        )}

      </body>
    </html>
  );
}
