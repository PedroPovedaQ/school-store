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
      router.push("/shop/checkout");
    }
  }, [orderDetails, router]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const { formData, items, subtotal, shipping, total } = orderDetails;

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 lg:pr-8 mb-8 lg:mb-0">
          <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Thank you for your order!
            </h2>
            <p className="mb-4">
              You should expect an email soon with further details.
            </p>
            <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
            <p>
              Name: {formData.first_name} {formData.last_name}
            </p>
            <p>Email: {formData.email}</p>
            <p>
              Address: {formData.address}, {formData.apartment}
            </p>
            <p>
              {formData.city}, {formData.state} {formData.zip_code}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-gray-100 p-4">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center mb-4">
              <Image src={item.image} alt={item.name} width={60} height={60} />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <span className="ml-2">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="text-sm">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>USD ${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <div className="flex flex-wrap justify-center">
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
        </div>
      </footer>
    </div>
  );
}
