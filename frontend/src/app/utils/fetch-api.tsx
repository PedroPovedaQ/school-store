import qs from "qs";
import { getStrapiURL } from "./api-helpers";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options: FetchOptions = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 0 },
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    };
    console.log("mergedOptions", mergedOptions);

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`
    );
  }
}
