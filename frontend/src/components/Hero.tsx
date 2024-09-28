import Link from "next/link";
import Image from "next/image";
import HighlightedText from "./HighlightedText";
import { getStrapiMedia } from "../utils/api-helpers";
import { renderButtonStyle } from "../utils/render-button-style";
import { Picture } from "../utils/model";
import { Button } from "@/models";

interface HeroProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: Picture;
    buttons: Button[];
  };
}

export default function Hero({ data }: HeroProps) {
  const imgUrl = getStrapiMedia(data.picture.data.attributes.url);

  return (
    <section className="dark:bg-black dark:text-gray-100">
      <div className="container flex flex-col justify-center items-center px-6 mx-auto sm:py-12 lg:px-36 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center py-6 text-center rounded-lg lg:max-w-md xl:max-w-lg lg:text-left  self-start">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="mb-8 font-playfair text-5xl font-bold leading-none sm:text-6xl"
          />

          <HighlightedText
            text={data?.description}
            tag="p"
            className="mb-8 text-lg tmt-6 sm:mb-12"
            color="dark:text-violet-400"
          />
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            {data.buttons.map((button: Button, index: number) => (
              <Link
                key={index}
                href={button.url}
                className={renderButtonStyle(button.type)}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center pl-6 mt-8 h-72 sm:h-full lg:mt-0 lg:block">
          <Image
            src={imgUrl}
            alt={
              data.picture.data.attributes.alternativeText || "none provided"
            }
            className="object-contain h-full rounded-lg"
            width={600}
            height={600}
          />
        </div>
      </div>
    </section>
  );
}
