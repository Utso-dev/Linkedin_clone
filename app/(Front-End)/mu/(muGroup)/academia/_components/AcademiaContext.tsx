import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

interface AcademiaContextProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  stateCode: string;
  setStateCode: Dispatch<SetStateAction<string>>;
}

const AcademiaContext = createContext<AcademiaContextProps | undefined>(undefined);

export const AcademiaProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ stateCode, setStateCode ] = useState("");

  return (
    <AcademiaContext.Provider value={{ isOpen, setIsOpen, stateCode, setStateCode }}>
      {children}
    </AcademiaContext.Provider>
  );
};

export const useAcademiaContext = () => {
  const context = useContext(AcademiaContext);
  if (!context) {
    throw new Error("useAcademiaContext must be used within an AcademiaProvider");
  }
  return context;
};
