"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import { ProductCarousel } from "./ProductCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faPlus,
  faMinus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

type ProductDetailsProps = {
  product: any; // Replace 'any' with a proper type for your product
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();
  const inventory = product.attributes.inventory;
  console.log("Inventory:", inventory);
  const handleAddToCart = () => {
    if (inventory > 0) {
      addToCart({
        id: product.id,
        name: product.attributes.name,
        price: product.attributes.price,
        quantity: quantity,
        image:
          getStrapiMedia(product.attributes.images.data[0].attributes.url) ||
          "",
      });
      openCart();
      toast.success(`${product.attributes.name} added to cart!`, {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Custom components for markdown rendering
  const customComponents = {
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="pl-5 mb-4 list-disc">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="pl-5 mb-4 list-decimal">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="mb-2">{children}</li>
    ),
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="mb-4 text-2xl font-bold">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="mb-3 text-xl font-semibold">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="mb-2 text-lg font-semibold">{children}</h3>
    ),
  };

  // Function to extract text from description
  const extractDescription = (description: any): string => {
    if (typeof description === "string") return description;
    if (Array.isArray(description)) {
      return description
        .map((block) => {
          if (block.type === "paragraph") {
            return block.children.map((child: any) => child.text).join(" ");
          }
          return "";
        })
        .join("\n\n");
    }
    return "";
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex justify-center">
        {/* <ImageSliderNoAlt data={product.attributes.images.data} /> */}
        <ProductCarousel data={product.attributes.images.data} />
      </div>
      <div>
        <h1 className="mb-4 text-3xl font-bold">{product.attributes.name}</h1>
        <p className="mb-4 text-2xl font-semibold">
          {product.attributes.price} Points
        </p>
        {inventory > 0 && inventory < 5 && (
          <p className="mb-2 font-semibold text-red-600">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            Only {inventory} left!
          </p>
        )}
        {inventory > 0 ? (
          <>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <div className="flex gap-2 items-center mt-1">
                <button
                  className="p-1 text-gray-600 transition-colors hover:text-gray-800"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={inventory}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(inventory, Math.max(1, parseInt(e.target.value)))
                    )
                  }
                  className="w-16 text-center border-b border-gray-300"
                />
                <button
                  className="p-1 text-gray-600 transition-colors hover:text-gray-800"
                  onClick={() => setQuantity(Math.min(inventory, quantity + 1))}
                  disabled={quantity >= inventory}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <button
              className="px-4 py-2 w-full text-white bg-black rounded transition-colors hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to cart →
            </button>
          </>
        ) : (
          <p className="mb-4 text-xl font-semibold text-red-600">Sold Out</p>
        )}
        <div className="mt-8">
          <h2 className="mb-2 text-xl font-semibold">Description</h2>
          <ReactMarkdown components={customComponents as any}>
            {extractDescription(product.attributes.description)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
