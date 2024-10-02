import Link from "next/link";
import { getStrapiMedia } from "@/app/utils/api-helpers";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/${product.attributes.slug}`}>
      <div className="flex flex-col cursor-pointer">
        <div className="overflow-hidden relative mb-2 bg-gray-100 rounded-lg aspect-square">
          <img
            src={getStrapiMedia(
              product.attributes.images.data[0].attributes.url
            )}
            alt={product.attributes.name}
            className="object-contain w-full h-full transition-opacity duration-300"
          />
          {product.attributes.images.data.length && (
            <img
              src={getStrapiMedia(
                product.attributes.images?.data[1]
                  ? product.attributes.images.data[1].attributes.url
                  : product.attributes.images.data[0].attributes.url
              )}
              alt={`${product.attributes.name} - Hover`}
              className="object-contain absolute inset-0 w-full h-full bg-white opacity-100 transition-opacity duration-300"
            />
          )}
        </div>
        <h3 className="text-lg font-medium">{product.attributes.name}</h3>
        <p className="text-gray-600">{product.attributes.price} Points</p>
      </div>
    </Link>
  );
}
