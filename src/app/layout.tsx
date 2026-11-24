import type { Metadata } from "next";
import { Raleway, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GoogleAnalyticsProvider } from "@/modules/shared/components/google-analytics";
import { ChatWidget } from "@/modules/chatbot/ui/chat-widget";

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

const description =
  "IFFA, the International Film Festival of Australia, celebrates storytelling from around the world in Melbourne through its annual awards, festival screenings and Talent Lab.";

// The one share card for the whole site, image in public/. Pages set their own
// <title> but not `openGraph`, so they all inherit this card.
export const metadata: Metadata = {
  metadataBase: new URL("https://iffa.com.au"),
  title: "IFFA Awards",
  description,
  openGraph: {
    type: "website",
    siteName: "IFFA, International Film Festival of Australia",
    locale: "en_AU",
    title: "IFFA Awards",
    description,
    images: [
      {
        // A static JPEG: link previewers such as WhatsApp handle it more reliably than webp.
        url: "/opengraph-image.jpg",
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "IFFA, International Film Festival of Australia: Awards, Festival, Talent Lab, over the Melbourne skyline at dusk",
      },
    ],
  },
  // X reads the og: title, description and image; this makes the image large.
  twitter: { card: "summary_large_image" },
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
        {/* Site chatbot (src/modules/chatbot). Set NEXT_PUBLIC_CHATBOT_ENABLED=false to hide it. */}
        {process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== "false" && <ChatWidget />}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalyticsProvider
            gaId={process.env.NEXT_PUBLIC_GA_ID}
          />
        )}

      </body>
    </html>
  );
}
