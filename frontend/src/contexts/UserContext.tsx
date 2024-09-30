"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  email: string;
  isValidated: boolean;
  setEmail: (email: string) => void;
  setIsValidated: (isValidated: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Load state from localStorage on mount
    const storedEmail = localStorage.getItem("userEmail");
    const storedValidation = localStorage.getItem("userValidated");
    console.log(storedValidation, "storedValidation");
    console.log(storedEmail, "storedEmail");
    if (storedEmail) setEmail(storedEmail);
    if (storedValidation) setIsValidated(storedValidation === "true");
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userValidated", isValidated.toString());
    console.log(isValidated, "isValidated", email, "email");
  }, [email, isValidated]);

  return (
    <UserContext.Provider
      value={{ email, isValidated, setEmail, setIsValidated }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
