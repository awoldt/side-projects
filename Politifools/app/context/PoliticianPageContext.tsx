import type { User } from "@supabase/supabase-js";
import React, { createContext, useState } from "react";
import type { PoliticianPageData } from "~/types";

interface AppContextInterface {
  politicianDetails: PoliticianPageData | null;
  setPoliticianDetails: React.Dispatch<
    React.SetStateAction<PoliticianPageData | null>
  >;
  userDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AppContext = createContext<AppContextInterface>({
  politicianDetails: null,
  setPoliticianDetails: () => {},
  userDetails: null,
  setUserDetails: () => {},
});

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
  backendData: PoliticianPageData;
  userData: User | null;
}> = ({ children, backendData, userData }) => {
  const [politicianDetails, setPoliticianDetails] =
    useState<PoliticianPageData | null>(backendData);

  const [userDetails, setUserDetails] = useState<User | null>(userData);

  return (
    <AppContext.Provider
      value={{
        politicianDetails,
        setPoliticianDetails,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
