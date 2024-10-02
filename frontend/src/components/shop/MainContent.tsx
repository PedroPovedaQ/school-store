"use client";

import Image from "next/image";
import CartSheet from "@/components/shop/CartSheet";
import ProductCard from "@/components/shop/ProductCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useMemo } from "react";

// Helper function to get unique categories
const getUniqueCategories = (products: any[]): string[] => {
  const categorySet = new Set(
    products.map((product) => product.attributes.category.data.attributes.Name)
  );
  return ["All", ...Array.from(categorySet)];
};

export default function MainContent({ data }: { data: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => getUniqueCategories(data), [data]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return data;
    return data.filter(
      (product) =>
        product.attributes.category.data.attributes.Name === activeCategory
    );
  }, [data, activeCategory]);

  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <div className="w-full min-h-screen bg-white">
        <header className="flex py-4 align-middle bg-oakridge w-100">
          <div className="container flex justify-between items-center px-4 mx-auto">
            <h1 className="flex items-center text-3xl font-bold">
              <Image
                src="/asset-logo.png"
                alt="Oak Ridge Pioneer Hero Store Logo"
                width={50}
                height={50}
                className="text-black"
              />
              <span className="ml-2 font-bold text-white text-italic">
                Oak Ridge Pioneer Hero Store
              </span>
            </h1>
            <CartSheet />
          </div>
        </header>
        <div className="container p-8 w-full max-w-full">
          <Tabs defaultValue="All" onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  );
}
