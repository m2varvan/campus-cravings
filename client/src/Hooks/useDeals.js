import { DealsContext } from "../Contexts/DealsContext";
import React from 'react';

export const useDeals = () => {
  const context = React.useContext(DealsContext);
  if (!context) {
    throw new Error("useDeals must be used within a DealsProvider");
  }
  return context;
};