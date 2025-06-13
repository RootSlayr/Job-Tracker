// context/PageTextContext.js
"use client";
import { createContext, useContext, useState } from "react";

const PageTextContext = createContext();

export const usePageText = () => useContext(PageTextContext);

export const PageTextProvider = ({ children }) => {
  const [pageText, setPageText] = useState(null);

  return (
    <PageTextContext.Provider value={{ pageText, setPageText }}>
      {children}
    </PageTextContext.Provider>
  );
};
