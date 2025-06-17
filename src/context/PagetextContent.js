// context/PageTextContext.js
"use client";
import { createContext, useContext, useState } from "react";

const PageTextContext = createContext();

export const usePageText = () => useContext(PageTextContext);

export const PageTextProvider = ({ children }) => {
  const [pageText, setPageText] = useState(null);
  // const [resumeText, setResumeText] = useState(null);

  return (
    <PageTextContext.Provider value={{ pageText, setPageText }}>
      {/* <PageTextContext.Provider value={{ resumeText, setResumeText }}> */}
      {children}
      {/* </PageTextContext.Provider> */}
    </PageTextContext.Provider>
  );
};
