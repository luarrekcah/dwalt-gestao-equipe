import React, {createContext, useContext, useState} from 'react';

const BusinessContext = createContext();

export const BusinessProvider = ({children}) => {
  const [business, setBusiness] = useState(null);

  return (
    <BusinessContext.Provider value={{business, setBusiness}}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
