import { fetchAPI } from "@/app/utils/fetch-api";
import MainContent from "@/components/shop/MainContent";

const getData = async () => {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    console.log("token", token);
    const path = `/products`;
    const urlParamsObject = {
      sort: { createdAt: "desc" },
      populate: {
        images: { fields: ["url"] },
        category: { fields: ["name"] },
      },
      pagination: {
        start: 0,
        limit: 100,
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    console.log(JSON.stringify(responseData, null, 2), "responseData");
    return {
      data: responseData.data,
    };
  } catch (error) {
    console.log(error, "error");
    console.error(error);
    return {
      data: [],
    };
  }
};

export default async function Home() {
  const { data } = await getData();

  return <MainContent data={data} />;
}

export const metadata = {
  title: "Oak Ridge Pioneer Hero Store",
  description: "Oak Ridge Pioneer Hero Store",
};
