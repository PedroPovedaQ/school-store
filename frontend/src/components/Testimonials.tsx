import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

interface Testimonial {
  text: string;
  authorName: string;
  picture: {
    data: {
      id: string;
      attributes: {
        name: string;
        alternativeText: string;
        url: string;
      };
    };
  };
}

interface TestimonialsProps {
  data: {
    id: string;
    title: string;
    description: string;
    testimonials: Testimonial[];
  };
}

function Testimonial({ text, authorName, picture }: Readonly<Testimonial>) {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-lg">
      <div className="flex justify-center mb-4">
        <FontAwesomeIcon
          icon={faQuoteLeft}
          className="text-mj-forest-green quote-icon"
          size="lg"
        />
      </div>

      <p className="text-lg text-center text-gray-700">{text}</p>
      <p className="mt-4 text-center text-gray-600">{authorName}</p>
    </div>
  );
}

export default function Testimonials({ data }: TestimonialsProps) {
  return (
    <section className="dark:bg-black dark:text-gray-100 m:py-12 lg:py-24 lg:pb-16">
      <div className="container py-4 mx-auto space-y-2 text-center">
        <h1 className="pb-12 font-playfair text-5xl font-bold text-center">
          {data.title}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 px-6 md:grid-cols-3 xl:px-36">
        {data.testimonials.map((testimonial: Testimonial, index: number) => (
          <Testimonial key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
