"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const validateUser = async (email: string, password: string) => {
  // This would typically be a server action, but for this example, we'll do client-side validation
  return email.endsWith("@ocps.net") && password === "Hero123";
};

const UserValidationSheet: React.FC = () => {
  const { email, isValidated, setEmail, setIsValidated } = useUser();
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isValidated) {
      setIsOpen(false);
    }
  }, [isValidated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateUser(email, password);
    if (isValid) {
      setIsValidated(true);
      setIsOpen(false);
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-full sm:max-w-full">
        <SheetHeader>
          <SheetTitle>Welcome Pioneer!</SheetTitle>
          <SheetTitle>Login</SheetTitle>
          <SheetDescription>
            Please enter your email and password to continue.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full border-t-4 border-blue-500 border-solid"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserValidationSheet;
