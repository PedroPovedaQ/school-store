import Link from "next/link";
import { Picture } from "../utils/model";
import { getStrapiMedia } from "../utils/api-helpers";

interface FeaturesProps {
  data: {
    heading: string;
    description: string;
    feature: Feature[];
  };
}

interface Feature {
  id: string;
  title: string;
  description: string;
  showLink: boolean;
  newTab: boolean;
  url: string;
  text: string;
  media: Picture;
}

function Feature({
  title,
  description,
  showLink,
  newTab,
  url,
  text,
  media,
}: Feature) {
  const mediaUrl = getStrapiMedia(media.data?.attributes.url);

  return (
    <div className="h-full bg-white rounded-lg border shadow-lg">
      <div className="rounded-t-lg aspect-w-16 aspect-h-9">
        <img
          src={mediaUrl}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <div className="p-5 text-base text-center text-gray-700">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Features({ data }: FeaturesProps) {
  return (
    <section className="!pt-8 dark:bg-black dark:text-gray-100 m:py-12 lg:py-16">
      <div className="container py-4 mx-auto space-y-2 text-center">
        <h2 className="pb-4 font-playfair text-5xl font-bold">
          {data.heading}
        </h2>
        <p className="dark:text-gray-400">{data.description}</p>
      </div>
      <div className="container grid gap-4 justify-center mx-auto my-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.feature.map((feature: Feature, index: number) => (
          <div className={index === 2 ? "hidden lg:block" : ""}>
            <Feature key={index} {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
}
