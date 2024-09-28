import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "./utils/api-helpers";
import Link from "next/link";
import CartSheet from "@/components/shop/CartSheet";
import Image from "next/image";

const getData = async () => {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    console.log("token", token);
    const path = `/products`;
    const urlParamsObject = {
      sort: { createdAt: "desc" },
      populate: {
        images: { fields: ["url"] },
      },
      pagination: {
        start: 0,
        limit: 100,
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    console.log(responseData, "responseData");
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

function ProductCard({ product }: { product: any }) {
  console.log(product.attributes.images.data[0].attributes.url, "product");
  return (
    <Link href={`/${product.attributes.slug}`}>
      <div className="flex flex-col cursor-pointer">
        <div className="overflow-hidden relative mb-2 bg-gray-100 rounded-lg aspect-square">
          <img
            src={getStrapiMedia(
              product.attributes.images.data[0].attributes.url
            )}
            alt={product.attributes.name}
            className="object-cover w-full h-full transition-opacity duration-300"
          />
          {product.attributes.images.data.length && (
            <img
              src={getStrapiMedia(
                product.attributes.images?.data[1]
                  ? product.attributes.images.data[1].attributes.url
                  : product.attributes.images.data[0].attributes.url
              )}
              alt={`${product.attributes.name} - Hover`}
              className="object-cover absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 hover:opacity-100"
            />
          )}
        </div>
        <h3 className="text-lg font-medium">{product.attributes.name}</h3>
        <p className="text-gray-600">${product.attributes.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default async function Shop() {
  const { data } = await getData();

  return (
    <div className="min-h-screen bg-white">
      <header className="flex py-4 align-middle bg-gray-100 w-100">
        <div className="container flex justify-between items-center px-4 mx-auto">
          <h1 className="flex items-center text-3xl font-bold">
            {/* <Image
              src="/colorful-logo.png"
              alt="School "
              width={50}
              height={50}
              className="text-black"
            /> */}
            <span className="ml-2 font-bold text-gray-900 text-italic">
              Shop
            </span>
          </h1>
          <CartSheet />
        </div>
      </header>
      <div className="container p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Shop - School ",
  description: "Browse our collection of products",
};
