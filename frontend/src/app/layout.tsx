import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { Providers } from "./providers";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { FALLBACK_SEO } from "@/app/utils/constants";
import { Toaster } from "react-hot-toast";
import { getGlobal } from "@/utils/api-helpers";

// export async function generateMetadata({
//   params,
// }: {
//   params: { lang: string };
// }): Promise<Metadata> {
//   const meta = await getGlobal(params.lang);

//   if (!meta.data) return FALLBACK_SEO;

//   const { metadata, favicon } = meta.data.attributes;
//   const { url } = favicon.data.attributes;

//   return {
//     title: metadata.metaTitle,
//     description: metadata.metaDescription,
//     icons: {
//       icon: [new URL(url, getStrapiURL())],
//     },
//   };
// }

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  console.log(global, "global");
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;

  const { notificationBanner, navbar, footer } = global.data.attributes;

  // const navbarLogoUrl = getStrapiMedia(
  //   navbar.navbarLogo.logoImg.data?.attributes.url
  // );

  // const footerLogoUrl = getStrapiMedia(
  //   footer.footerLogo.logoImg.data?.attributes.url
  // );

  return (
    <html lang={params.lang}>
      <body>
        {/* <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
        /> */}

        <main className="flex-grow bg-mj-tan">
          <Providers>{children}</Providers>
        </main>

        <Banner data={notificationBanner} />

        {/* <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories.data}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        /> */}
        <Toaster />
      </body>
    </html>
  );
}

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }
