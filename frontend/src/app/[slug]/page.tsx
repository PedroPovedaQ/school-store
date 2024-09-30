import { fetchAPI } from "@/app/utils/fetch-api";
import Link from "next/link";
import CartSheet from "@/components/shop/CartSheet";
import ProductDetails from "@/components/shop/ProductDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ShopHeader from "@/components/shop/ShopHeader";

const getData = async (slug: string) => {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/products`;
    const urlParamsObject = {
      filters: { slug },
      populate: {
        images: { fields: ["url"] },
      },
    };
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // Add this line
    };
    const responseData = await fetchAPI(path, urlParamsObject, options as any);

    return {
      data: responseData.data[0],
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
    };
  }
};

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: product } = await getData(params.slug);
  if (!product) {
    return <div>Product not found</div>;
  }

  console.log(JSON.stringify(product, null, 2), "product");
  return (
    <div className="min-h-screen bg-white">
      <ShopHeader showCart={true} />
      <div className="container px-4 py-8 mx-auto">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: product } = await getData(params.slug);
  return {
    title: `${product?.attributes.name || "Product"} - School  Shop`,
    description: product?.attributes.description || "Product description",
  };
}
