"use client";

import React, { createContext, useCallback, useState } from "react";

export interface LoadingPageContextProps {
  start: (customChildren?: React.ReactNode) => void;
  complete: () => void;
}

export const LoadingPageContext = createContext<LoadingPageContextProps | undefined>(undefined);

export const LoadingPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customChildren, setCustomChildren] = useState<React.ReactNode | undefined>(undefined);

  const start = useCallback((customChildren?: React.ReactNode) => {
    setIsLoading(() => true);
    if (customChildren) setCustomChildren(() => customChildren);
  }, []);

  const complete = useCallback(() => {
    setIsLoading(() => false);
    setCustomChildren(() => undefined);
  }, []);

  const StringLoader = () => <p className="rounded-4 bg-white px-4 py-2 shadow">{customChildren ? customChildren : "Loading..."}</p>;

  return (
    <LoadingPageContext.Provider value={{ start, complete }}>
      {isLoading && (
        <div className="fixed inset-0 left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/[0.75]">
          {!customChildren && <StringLoader />}
          {customChildren && typeof customChildren === "string" && <StringLoader />}
          {customChildren && typeof customChildren !== "string" && <>{customChildren}</>}
        </div>
      )}
      {children}
    </LoadingPageContext.Provider>
  );
};
