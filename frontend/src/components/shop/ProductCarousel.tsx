"use client";
import * as React from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Image {
  id: number;
  attributes: {
    alternativeText: string | null;
    caption: string | null;
    url: string;
  };
}

interface ProductCarouselProps {
  data: Image[];
}

export function ProductCarousel({ data }: ProductCarouselProps) {
  return (
    <Carousel
      className="w-full max-w-lg"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((image, index) => {
          const imageUrl = getStrapiMedia(image.attributes.url);
          return (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex justify-center items-center p-6 aspect-square">
                    {imageUrl && (
                      <img
                        className="object-contain w-full h-full rounded-lg"
                        src={imageUrl}
                        alt={
                          image.attributes.alternativeText ||
                          `Product image ${index + 1}`
                        }
                        width={400}
                        height={400}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
