"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { DialogPay } from "@/components/DialogPay";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { sendOrderConfirmation, sendOrderNotification } from "../actions";
import ShopHeader from "@/components/shop/ShopHeader";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { setOrderDetails } = useOrder();
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    apartment: "",
    city: "",
    state: "Florida",
    zip_code: "",
  });
  const router = useRouter();

  const subtotal = cart.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;

  const handlePaymentInitiation = () => {
    setHasInitiatedPayment(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConfirmOrder = async () => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.from("orders").insert({
        ...formData,
        items: cart.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping,
        total,
      });

      if (error) throw error;

      console.log("Order created successfully:", data);

      // Call the server action to send the confirmation email to the customer
      try {
        const result = await sendOrderConfirmation(
          formData.email,
          cart,
          subtotal,
          shipping,
          total
        );
        console.log("Confirmation email sent successfully:", result);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // TODO: Implement error handling for email sending
      }

      // Call the server action to send the notification email to pedropovedaq@gmail.com
      try {
        const notificationResult = await sendOrderNotification(
          formData,
          cart,
          subtotal,
          shipping,
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
        shipping,
        total,
      });
      router.push("/shop/checkout/confirmation");
    } catch (error) {
      console.error("Error creating order:", error);
      // TODO: Implement error handling
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopHeader showCart={false} />
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 lg:pr-8 mb-8 lg:mb-0">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {/* Contact section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <div className="mt-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Email me with news and offers</span>
              </label>
            </div>
          </div>

          {/* Delivery section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery</h2>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option>United States</option>
            </select>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="First name"
                className="w-full sm:w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Last name"
                className="w-full sm:w-1/2 p-2 border rounded"
              />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full sm:w-1/3 p-2 border rounded"
              />
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                placeholder="ZIP code"
                className="w-full sm:w-1/3 p-2 border rounded"
              />
            </div>
          </div>

          {/* Payment section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="border rounded p-4 mb-4">
              <div className="flex items-center mb-4">
                <input type="radio" checked className="mr-2" />
                <span>CashApp</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                To complete your purchase, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-600 mb-4">
                <li>Click the "Initiate Payment" button below</li>
                <li>Send USD ${total.toFixed(2)} to $School</li>
                <li>Include your email address in the payment note</li>
                <li>Return to this page and click "Confirm Order" below</li>
              </ol>
              <DialogPay onConfirm={handlePaymentInitiation} />
            </div>
          </div>
          <button
            className={`w-full py-3 rounded ${
              hasInitiatedPayment
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!hasInitiatedPayment}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </div>

        <div className="w-full lg:w-1/3 bg-gray-100 p-4">
          {cart.map((item: any) => (
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

      {/* <footer className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
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
