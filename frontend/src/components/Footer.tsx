"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { CgWebsite } from "react-icons/cg";
import {
  AiFillTwitterCircle,
  AiFillYoutube,
  AiFillInstagram,
} from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
}

interface CategoryLink {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

function FooterLink({ url, text }: FooterLink) {
  const path = usePathname();
  return (
    <li className="flex justify-center" key={url}>
      <Link
        href={url}
        className={`hover:dark:text-violet-400 text-white text-lg ${
          path === url &&
          "dark:text-violet-400 dark:border-violet-400 font-bold"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
}

function CategoryLink({ attributes }: CategoryLink) {
  return (
    <li className="flex">
      <Link
        href={`/blog/${attributes.slug}`}
        className="hover:dark:text-violet-400 text-white text-lg"
      >
        {attributes.name}
      </Link>
    </li>
  );
}

function RenderSocialIcon({ social }: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite size={30} color="white" />;
    case "TWITTER":
      return <AiFillTwitterCircle size={30} color="white" />;
    case "YOUTUBE":
      return <AiFillYoutube size={30} color="white" />;
    case "INSTAGRAM":
      return <AiFillInstagram size={30} color="white" />;
    case "TIKTOK":
      return <FaTiktok size={30} color="white" />;
    default:
      return null;
  }
}

export default function Footer({
  logoUrl,
  logoText,
  menuLinks,
  categoryLinks,
  legalLinks,
  socialLinks,
}: {
  logoUrl: string | null;
  logoText: string | null;
  menuLinks: Array<FooterLink>;
  categoryLinks: Array<CategoryLink>;
  legalLinks: Array<FooterLink>;
  socialLinks: Array<FooterLink>;
}) {
  return (
    <footer className="dark:bg-black dark:text-gray-50 bg-mj-forest-green">
      <div className="container px-4 md:px-6 py-8 mx-auto space-y-6 divide-y divide-gray-400 divide-opacity-50">
        <div className="grid grid-cols-1 gap-8 items-center">
          {/* Logo and company info */}
          <div className="flex flex-col items-center space-y-4">
            <Logo src={logoUrl} imgWidth={100} imgHeight={100} />
            <p className="text-2xl font-bold text-center font-cormorant text-mj-gold !mt-1">
              Hero Store
            </p>
          </div>

          {/* Menu Links */}
          <div>
            <ul className="space-y-3 text-center">
              {menuLinks.map((link: FooterLink) => (
                <FooterLink key={link.id} {...link} />
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex justify-center flex-wrap gap-6">
              {socialLinks.map((link: FooterLink) => (
                <a
                  key={link.id}
                  rel="noopener noreferrer"
                  href={link.url}
                  title={link.text}
                  target={link.newTab ? "_blank" : "_self"}
                  className="flex justify-center items-center w-12 h-12 rounded-full dark:bg-violet-400 dark:text-gray-900"
                >
                  <RenderSocialIcon social={link.social} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="flex flex-col items-center pt-6">
          <span className="text-base text-center mb-3 text-white">
            ©{new Date().getFullYear()} Hero Store. All rights reserved
          </span>
          <ul className="flex flex-wrap justify-center space-x-6">
            {legalLinks.map((link: FooterLink) => (
              <li key={link.id}>
                <Link
                  href={link.url}
                  className="text-base text-white hover:text-gray-300"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
