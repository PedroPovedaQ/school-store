"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { ProductCarousel } from "./ProductCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

type ProductDetailsProps = {
  product: any; // Replace 'any' with a proper type for your product
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.attributes.name,
      price: product.attributes.price,
      quantity: quantity,
      image:
        getStrapiMedia(product.attributes.images.data[0].attributes.url) || "",
    });
    openCart(); // Open the cart after adding the item

    // Show toast notification
    toast.success(`${product.attributes.name} added to cart!`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  // Custom components for markdown rendering
  const customComponents = {
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc pl-5 mb-4">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal pl-5 mb-4">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="mb-2">{children}</li>
    ),
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl font-semibold mb-3">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg font-semibold mb-2">{children}</h3>
    ),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex justify-center">
        {/* <ImageSliderNoAlt data={product.attributes.images.data} /> */}
        <ProductCarousel data={product.attributes.images.data} />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.attributes.name}</h1>
        <p className="text-2xl font-semibold mb-4">
          ${product.attributes.price.toFixed(2)}
        </p>
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity:
          </label>
          <div className="flex items-center mt-1 gap-2">
            <button
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 text-center border-b border-gray-300"
            />
            <button
              className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setQuantity(quantity + 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
        <button
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          onClick={handleAddToCart}
        >
          Add to cart →
        </button>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <ReactMarkdown components={customComponents as any}>
            {product.attributes.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
