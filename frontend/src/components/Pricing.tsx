import Link from "next/link";
import { renderButtonStyle } from "../utils/render-button-style";

interface Feature {
  id: string;
  attributes: {
    name: string;
  };
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  pricePeriod: string;
  isRecommended: boolean;
  product_features: {
    data: Feature[];
  };
}

interface PriceProps {
  data: {
    id: string;
    title: string;
    plans: Plan[];
  };
}

export default function Pricing({ data }: PriceProps) {
  return (
    <section className="bg-mj-tan py-12">
      <div className="container px-4 mx-auto">
        <div className="mx-auto mb-5 md:gmb-10 max-w-2xl text-center">
          <h2 className="font-playfair text-4xl font-bold lg:text-5xl">
            {data.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-stretch mx-auto max-w-5xl">
          {data.plans.map((plan: Plan) => {
            const isFree = plan.price === 0;
            const price = isFree ? "Free" : `$${plan.price}`;

            return (
              <div
                key={plan.id}
                className="p-4 mb-8 w-full sm:mx-40 lg:mx-0 lg:w-1/3 lg:mb-0"
              >
                <div
                  className={`flex flex-col p-6 space-y-6 rounded-lg shadow-2xl sm:p-8 h-full min-w-[300px] ${
                    plan.isRecommended ? "bg-yellow-100" : "bg-gray-100"
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="mb-6 text-3xl font-bold">{plan.name}</h4>
                    <span className="text-6xl font-bold">
                      {price}
                      {!isFree && (
                        <span className="ml-1 text-sm tracking-wid text-gray-800">
                          {plan.pricePeriod.toLowerCase()}
                        </span>
                      )}
                    </span>
                  </div>
                  <p
                    className={`mt-3 text-lg font-bold leading-relaxed text-gray-600`}
                  >
                    Features
                  </p>
                  <ul
                    className={`flex-1 mb-6 ${
                      plan.isRecommended
                        ? "text-mj-earth-green font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {plan.product_features.data.map((feature: Feature) => (
                      <li key={feature.id} className="flex mb-2 space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className={`flex-shrink-0 w-6 h-6 ${
                            plan.isRecommended
                              ? "dark:text-gray-900"
                              : "dark:text-gray-400"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span>{feature.attributes.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/signup`}>
                    <button type="button" className={renderButtonStyle("")}>
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
