// The homepage trailers as they were before cms-hub managed them. Served when
// the API is unreachable or the list has never been saved in the CMS — so the
// homepage looks exactly as it did until someone curates it there. Once saved,
// the CMS is authoritative and this file is only the outage fallback.

export type HomepageTrailer = {
  id: string;
  title: string;
  videoUrl: string;
  youtubeUrl?: string;
  learnMoreUrl?: string;
};

const CF = "https://dhbdzeb2cbayq.cloudfront.net";

export const fallbackTrailers: HomepageTrailer[] = [
  { id: "oman", title: "Oman: A Global Filming Destination", videoUrl: `${CF}/iffa/videos/oman-video/oman_bg.m3u8`, youtubeUrl: "https://www.youtube.com/watch?v=AdNUJTBD8Sk", learnMoreUrl: "/oman" },
  { id: "club-kid", title: "Club Kid", videoUrl: `${CF}/iffa/videos/Club_Kid/CLUB_KID.m3u8`, youtubeUrl: "https://youtu.be/dhj8K_KZsb8" },
  { id: "balandru", title: "Balandru", videoUrl: `${CF}/iffa/videos/balandrau/balandrau.m3u8`, youtubeUrl: "https://www.youtube.com/watch?v=-F3WzHG-m_I" },
  { id: "firebreak", title: "Firebreak", videoUrl: `${CF}/iffa/videos/firebreak/firebreak.m3u8`, youtubeUrl: "https://youtu.be/5YXhpQ7wrL8?si=2ePMrOPQ0iXiczSD" },
  { id: "stolen-girl", title: "The Stolen Girl", videoUrl: `${CF}/iffa/videos/hero3/hero-3.m3u8`, youtubeUrl: "https://www.youtube.com/watch?v=huMtYtMoN24" },
];
