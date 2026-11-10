import type { IconType } from "react-icons";
import { FaFacebook, FaImdb, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

export type SocialLink = {
  icon: IconType;
  href: string;
  label: string;
  /** Somewhere a visitor can follow or subscribe, as opposed to a listing like IMDb. */
  followable: boolean;
};

/** IFFA's official profiles, shared by the footer and the trailer popup. */
export const IFFA_SOCIAL_LINKS: SocialLink[] = [
  { icon: FaInstagram, href: "https://www.instagram.com/iffaawards/", label: "Instagram", followable: true },
  { icon: FaFacebook, href: "https://www.facebook.com/iffaawardss", label: "Facebook", followable: true },
  { icon: FaYoutube, href: "https://www.youtube.com/channel/UCO2xJ6Cw1-5o1iolIJtO4yQ?sub_confirmation=1", label: "YouTube", followable: true },
  { icon: FaLinkedin, href: "https://www.linkedin.com/company/iffaawards/", label: "LinkedIn", followable: true },
  { icon: FaImdb, href: "https://m.imdb.com/event/ev0074610/2025/1/?ref_=ev_tl_yr_1", label: "IMDb", followable: false },
];
