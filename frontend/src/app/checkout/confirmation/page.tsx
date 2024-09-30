"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useOrder } from "@/contexts/OrderContext";

export default function ConfirmationPage() {
  const router = useRouter();
  const { orderDetails } = useOrder();

  useEffect(() => {
    if (!orderDetails) {
      // Redirect to checkout if no order details are available
      router.push("/checkout");
    }
  }, [orderDetails, router]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const { formData, items, subtotal, total } = orderDetails;

  return (
    <div className="min-h-screen bg-white">
      <main className="container flex flex-col px-4 py-8 mx-auto lg:flex-row">
        <div className="mb-8 w-full lg:w-2/3 lg:pr-8 lg:mb-0">
          <h1 className="mb-6 text-2xl font-bold">Order Confirmation</h1>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">
              Thank you for your order!
            </h2>
            <p className="mb-4">
              You should expect an email soon with further details.
            </p>
            <h3 className="mb-2 text-lg font-semibold">Order Details:</h3>
            <p>
              Name: {formData.first_name} {formData.last_name}
            </p>
            <p>Email: {formData.email}</p>
          </div>
        </div>

        <div className="p-4 w-full bg-gray-100 lg:w-1/3">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center mb-4">
              <Image src={item.image} alt={item.name} width={60} height={60} />
              <div className="flex-grow ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <span className="ml-2">{item.price * item.quantity} Points</span>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{total} Points</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="container px-4 py-8 mx-auto text-sm text-center text-gray-500">
        {/* <div className="flex flex-wrap justify-center">
          <Link href="/refund-policy" className="mr-4 mb-2">
            Refund policy
          </Link>
          <Link href="/shipping-policy" className="mr-4 mb-2">
            Shipping policy
          </Link>
          <Link href="/privacy-policy" className="mr-4 mb-2">
            Privacy policy
          </Link>
          <Link href="/terms-of-service" className="mb-2">
            Terms of service
          </Link>
        </div> */}
      </footer>
    </div>
  );
}
