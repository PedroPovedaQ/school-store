"use client";

import ShopHeader from "@/components/shop/ShopHeader";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useUser } from "@/contexts/UserContext";
import { getStrapiMedia } from "@/utils/api-helpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder, sendOrderNotification } from "../../app/actions";

export default function CheckoutContent() {
  const { cart, clearCart } = useCart();
  const { setOrderDetails } = useOrder();
  const user = useUser();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: "",
    last_name: "",
    student_id: "",
    password: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const router = useRouter();

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
    formData.first_name.trim() !== "" &&
    formData.last_name.trim() !== "" &&
    formData.student_id.trim() !== "" &&
    formData.password.trim() !== "";

  const handleConfirmOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setOrderError(null);

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
      clearCart();
    } catch (error) {
      console.error("Error processing order:", error);
      setOrderError("Error Processing Order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
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
              className="p-2 w-full rounded border transition-colors duration-300"
            />
          </div>

          {/* Name section */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Student Information</h2>
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
            <div className="flex gap-4 pr-2 mt-4 w-1/2">
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                placeholder="Student ID"
                className="p-2 w-full bg-white rounded border"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Password</h2>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="p-2 w-full bg-white rounded border"
              required
            />
          </div>

          <button
            className={`py-3 w-full text-white bg-black rounded ${
              isProcessing || !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-black"
            }`}
            onClick={handleConfirmOrder}
            disabled={isProcessing || !isFormValid}
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </button>

          {orderError && (
            <p className="mt-2 text-center text-red-600">{orderError}</p>
          )}
        </div>

        <div className="p-4 w-full bg-gray-100 lg:w-1/3">
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center mb-4">
              <img
                src={getStrapiMedia(item.image)}
                alt={item.name}
                width={60}
                height={60}
              />
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
    </div>
  );
}
