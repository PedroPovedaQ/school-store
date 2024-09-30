"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { getStrapiMedia } from "@/utils/api-helpers";

const CartSheet = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-black bg-white">
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Cart ({totalItems})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center mb-4">
                  <Image
                    src={getStrapiMedia(item.image)}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>{item.price} Points</p>
                    <div className="flex gap-2 items-center mt-1">
                      <button
                        className="p-1 text-gray-600 transition-colors hover:text-gray-800"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity === 1}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 text-center border-b border-gray-300"
                      />
                      <button
                        className="p-1 text-gray-600 transition-colors hover:text-gray-800"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="ml-4 text-black"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-4 font-semibold">
                Total: {totalPrice} Points
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Button
            className="w-full text-sm font-bold text-black"
            asChild
            disabled={cart.length === 0}
          >
            <Link href="/checkout" className="text-white bg-black">
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
