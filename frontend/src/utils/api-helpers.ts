import { fetchAPI } from "./fetch-api";

export function getStrapiURL(path = '') {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return '';
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the URL path with the Strapi URL
    return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ADDS DELAY TO SIMULATE SLOW API REMOVE FOR PRODUCTION
export const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time));

export async function getGlobal(lang: string): Promise<any> {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  
    if (!token)
      throw new Error("The Strapi API Token environment variable is not set.");
  
    const path = `/global`;
    const options = { headers: { Authorization: `Bearer ${token}` } };
  
    const urlParamsObject = {
      populate: [
        "metadata.shareImage",
        "favicon",
        "notificationBanner.link",
        "navbar.links",
        "navbar.navbarLogo.logoImg",
        "footer.footerLogo.logoImg",
        "footer.menuLinks",
        "footer.legalLinks",
        "footer.socialLinks",
        "footer.categories",
        "notificationEmails",
      ],
      locale: lang,
    };
    return await fetchAPI(path, urlParamsObject, options);
  }
  