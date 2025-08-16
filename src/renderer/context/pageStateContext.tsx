import React, { createContext, useContext, useRef, ReactNode } from "react";

type PageState = Record<string, any>;

interface PageStateContextType {
  savePageState: (routeKey: string, state: PageState) => void;
  getPageState: (routeKey: string) => PageState | null;
}

const PageStateContext = createContext<PageStateContextType | undefined>(
  undefined
);

interface PageStateProviderProps {
  children: ReactNode;
}

export const PageStateProvider: React.FC<PageStateProviderProps> = ({
  children,
}) => {
  const pageStateRef = useRef<Record<string, PageState>>({});

  const savePageState = (routeKey: string, state: PageState) => {
    pageStateRef.current[routeKey] = state;
  };

  const getPageState = (routeKey: string) => {
    return pageStateRef.current[routeKey] || null;
  };

  return (
    <PageStateContext.Provider value={{ savePageState, getPageState }}>
      {children}
    </PageStateContext.Provider>
  );
};

export const usePageState = (): PageStateContextType => {
  const context = useContext(PageStateContext);
  if (!context) {
    throw new Error("usePageState must be used within a PageStateProvider");
  }
  return context;
};
