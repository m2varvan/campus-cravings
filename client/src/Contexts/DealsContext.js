import React, { createContext, useState, useCallback } from "react";

export const DealsContext = createContext();

export const DealsProvider = ({ children, uuid }) => {
  const [allDeals, setAllDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Load all deals from API
  const loadAllDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("/api/all/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: uuid }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setAllDeals(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to load deals:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  // Update a deal's favorite status
  const updateDealFavorite = useCallback((dealID, isFavorited) => {
    setAllDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.dealID === dealID ? { ...deal, fave: isFavorited ? 1 : 0 } : deal
      )
    );
  }, []);

  // Update a deal's vote
  const updateDealVote = useCallback((dealID, userVote, totalVoteChange) => {
    setAllDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.dealID === dealID
          ? {
              ...deal,
              userVote,
              totalVote: deal.totalVote + totalVoteChange,
            }
          : deal
      )
    );
  }, []);

  // Update a deal's rating
  const updateDealRating = useCallback(
    (dealID, tasteRating, valueRating, portionRating, numRatings) => {
      setAllDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.dealID === dealID
            ? {
                ...deal,
                dealTasteRating: tasteRating,
                dealValueRating: valueRating,
                dealPortionRating: portionRating,
                numRatings: numRatings,
              }
            : deal
        )
      );
    },
    []
  );

  const value = {
    allDeals,
    loading,
    error,
    loadAllDeals,
    updateDealFavorite,
    updateDealVote,
    updateDealRating,
  };

  return (
    <DealsContext.Provider value={value}>{children}</DealsContext.Provider>
  );
};
