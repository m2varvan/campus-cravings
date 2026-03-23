import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import FavouriteDealList from "./FavouriteDealList";
import { renderWithDealsProvider } from "../../utils/test-utils";

describe("FavouriteDeals Component", () => {
  const mockDeals = [
    {
      dealID: 1,
      dealName: "Sushi Combo 1",
      restaurantName: "Test Restaurant 1",
      dealTasteRating: 5,
      dealValueRating: 5,
      dealPortionRating: 5,
      numRatings: 2
    },
    {
      dealID: 2,
      dealName: "Sushi Combo",
      restaurantName: "Sakura Sushi",
      dealTasteRating: 4,
      dealValueRating: 4,
      dealPortionRating: 4,
      numRatings: 2
    },
  ];

  let mockLoadFaveDeals;
  let setFaveDeals;

  function renderComponent() {
    mockLoadFaveDeals = jest.fn();
    setFaveDeals = jest.fn();

    renderWithDealsProvider(
      <FavouriteDealList 
        uuid={1}
        loadFaveDeals={mockLoadFaveDeals}
        faveDeals={mockDeals}
        setFaveDeals={setFaveDeals}
      />
    );
  }

  test("loadFaveDeals function is called on initial render", () => {
    renderComponent();
    expect(mockLoadFaveDeals).toHaveBeenCalled();
  });

  test("Deal name, restaurant, and average rating are displayed", async () => {
    renderComponent();

    // Check first deal
    expect(await screen.findByText("Sushi Combo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Restaurant 1")).toBeInTheDocument();
    expect(screen.getByText(/5\.0\/5/i)).toBeInTheDocument();

    // Check second deal
    expect(screen.getByText("Sushi Combo")).toBeInTheDocument();
    expect(screen.getByText("Sakura Sushi")).toBeInTheDocument();
    expect(screen.getByText(/4\.0\/5/i)).toBeInTheDocument();
  });

  test("Count of total favourite deals is displayed", async () => {
    renderComponent();

    expect(await screen.findByText(/2 favourite deals/i)).toBeInTheDocument();
  });

  test("A message saying the user has no favourites is shown if the user has not favourited any deals", async () => {
    mockLoadFaveDeals = jest.fn();
    setFaveDeals = jest.fn();

    renderWithDealsProvider(
      <FavouriteDealList 
        uuid={1}
        loadFaveDeals={mockLoadFaveDeals}
        faveDeals={[]}
        setFaveDeals={setFaveDeals}
      />
    );

    expect(await screen.findByText(/No deals favourited./i)).toBeInTheDocument();
  });


});