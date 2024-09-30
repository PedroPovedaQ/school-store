import { Metadata } from "next";
import CheckoutContent from "../../components/checkout/CheckoutContent";

export default function CheckoutPage() {
  return <CheckoutContent />;
}

export const metadata: Metadata = {
  title: "Checkout - Oak Ridge Pioneer Hero Store",
  description: "Checkout - Oak Ridge Pioneer Hero Store",
};
