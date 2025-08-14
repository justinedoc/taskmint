import { ReactElement } from "react";
import {
  FaLinkedin,
  FaPinterest,
  FaSquareInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

interface SocialNavsType {
  icon: ReactElement;
  name: string;
  url: string;
}

export const socialNavs: SocialNavsType[] = [
  {
    icon: <FaXTwitter size={20} />,
    name: "Twitter",
    url: "#",
  },
  {
    icon: <FaSquareInstagram size={20} />,
    name: "Instagram",
    url: "#",
  },
  {
    icon: <FaPinterest size={20} />,
    name: "Pinterest",
    url: "#",
  },
  {
    icon: <FaLinkedin size={20} />,
    name: "LinkedIn",
    url: "#",
  },
  {
    icon: <FaYoutube size={20} />,
    name: "YouTube",
    url: "#",
  },
] as const;
