"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { DialogPay } from "@/components/DialogPay";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  createOrder,
  sendOrderConfirmation,
  sendOrderNotification,
} from "../actions";
import ShopHeader from "@/components/shop/ShopHeader";
import { useUser } from "@/contexts/UserContext"; // Add this import

export default function CheckoutPage() {
  const { cart } = useCart();
  const { setOrderDetails } = useOrder();
  const user = useUser(); // Add this line to get the user context
  console.log(user, "user");
  const [formData, setFormData] = useState({
    email: user?.email || "", // Initialize email with user's email if available
    first_name: "",
    last_name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Add this check at the beginning of the component
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <ShopHeader showCart={false} />
        <main className="container flex flex-col justify-center items-center px-4 py-8 mx-auto">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Your cart is empty
          </h1>
          <p className="mb-6 text-gray-600">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Return to Homepage
          </Link>
        </main>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormValid =
    formData.first_name.trim() !== "" && formData.last_name.trim() !== "";

  const handleConfirmOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Create order in Strapi
      const orderData = await createOrder(formData, cart, total);
      console.log("Order created successfully:", orderData);

      // Send notification email to admin
      try {
        const notificationResult = await sendOrderNotification(
          formData,
          cart,
          total
        );
        console.log(
          "Notification email sent successfully:",
          notificationResult
        );
      } catch (notificationError) {
        console.error("Error sending notification email:", notificationError);
        // TODO: Implement error handling for notification email sending
      }

      // Set order details in context and redirect to confirmation page
      setOrderDetails({
        formData,
        items: cart,
        subtotal,
        total,
      });
      router.push("/checkout/confirmation");
    } catch (error) {
      console.error("Error processing order:", error);
      // TODO: Implement error handling
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopHeader showCart={false} />
      <main className="container flex flex-col px-4 py-8 mx-auto lg:flex-row">
        <div className="mb-8 w-full lg:w-2/3 lg:pr-8 lg:mb-0">
          <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

          {/* Contact section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Email</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 w-full bg-gray-100 rounded border transition-colors duration-300 cursor-not-allowed hover:bg-gray-200"
              disabled={true}
            />
          </div>

          {/* Name section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Name</h2>
            <div className="flex gap-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="p-2 w-full bg-white rounded border"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="p-2 w-full bg-white rounded border"
                required
              />
            </div>
          </div>

          <button
            className={`py-3 w-full text-white bg-blue-600 rounded ${
              isProcessing || !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            onClick={handleConfirmOrder}
            disabled={isProcessing || !isFormValid}
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </button>
        </div>

        <div className="p-4 w-full bg-gray-100 lg:w-1/3">
          {cart.map((item: any) => (
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

      {/* <footer className="container px-4 py-8 mx-auto text-sm text-center text-gray-500">
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
      </footer> */}
    </div>
  );
}
