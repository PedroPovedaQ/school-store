import { Button } from "@/models";
import Link from "next/link";

interface TextSectionProps {
  data: {
    id: string;
    title: string;
    description: string;
    button: Button;
  };
}

export default function TextSection({ data }: TextSectionProps) {
  return (
    <div className="flex flex-col pb-4 md:flex-row bg-mj-tan">
      <div className="flex flex-col justify-center items-start pt-12 md:p-6 md:pt-12 xl:p-16 bg-mj-tan lg:px-48 xl:px-64">
        <h2 className="px-4 pt-0 mb-12 w-full font-playfair text-5xl font-bold text-center">
          {data.title}
        </h2>
        <p className="px-4 pt-0 mb-4 text-lg text-center">{data.description}</p>
        <Link href={data.button.url} className="self-center">
          <button className="px-8 py-3 mt-4 text-lg font-semibold rounded-full bg-green-500 border border-1 border-black dark:text-gray-9000">
            {data.button.text}
          </button>
        </Link>
      </div>
    </div>
  );
}
