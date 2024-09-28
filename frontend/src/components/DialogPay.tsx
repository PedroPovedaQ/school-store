"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react"; // Import useState

export function DialogPay({
  onConfirm,
  amount,
}: {
  onConfirm?: () => void;
  amount?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to manage dialog visibility with explicit type
  const [isButtonFaded, setIsButtonFaded] = useState<boolean>(false); // State to manage button faded state

  const handlePay = () => {
    if (onConfirm) {
      onConfirm(); // Call onConfirm if it's provided
    }
    const url = `https://cash.app/$DarrienSeqqoya${
      amount && amount > 0 ? `/${amount}` : ""
    }`;
    window.open(url, "_blank");
    setIsOpen(false); // Close the dialog after opening the link
    setIsButtonFaded(true); // Fade the button after clicking
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`block self-center px-4 py-2 mt-8 w-48 text-center text-white bg-green-500 hover:bg-green-600 ${
            isButtonFaded ? "opacity-50" : ""
          }`} // Apply faded class based on state
        >
          Pay with CashApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redirecting to CashApp...</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DialogDescription>
            Return to this page after payment
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button
            onClick={handlePay}
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
