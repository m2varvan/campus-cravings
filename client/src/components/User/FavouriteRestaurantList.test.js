import { render, screen, } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import FavouriteRestaurantList from "./FavouriteRestaurantList";
import { renderWithDealsProvider } from "../../utils/test-utils";

describe("FaveRestaurantList Component", () => {
  const mockRestaurants = [
    {
      restaurant_id: 1,
      restaurant_name: "Test Restaurant 1",
      street_address: "123 Main St",
      unit: null,
      city: "Waterloo",
      province: "ON",
      postal_code: "N2L 3G1",
      phone_number: "519-555-1234",
      website_url: "https://testrestaurant1.com",
      cuisine: "Italian",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-06-01T00:00:00Z",
      num_ratings: 3,
      avg_rating: 4.5
    },
    {
      restaurant_id: 2,
      restaurant_name: "Sakura Sushi",
      street_address: "456 Queen St",
      unit: "Unit 2",
      city: "Toronto",
      province: "ON",
      postal_code: "M5H 2N2",
      phone_number: "416-555-5678",
      website_url: "https://sakurasushi.com",
      cuisine: "Japanese",
      created_at: "2024-02-01T00:00:00Z",
      updated_at: "2024-06-15T00:00:00Z",
      num_ratings: 38,
      avg_rating: 4
    },
  ];

  let mockLoadFaveRestaurants;
  let setFaveRestaurants;

  function renderComponent() {
    mockLoadFaveRestaurants = jest.fn();
    setFaveRestaurants = jest.fn();

    renderWithDealsProvider(
      <FavouriteRestaurantList
        uuid={1}
        loadFaveRestaurants={mockLoadFaveRestaurants}
        faveRestaurants={mockRestaurants}
        setFaveRestaurants={setFaveRestaurants}
      />
    );
  }

  test("loadFaveRestaurants function is called on initial render", () => {
    renderComponent();
    expect(mockLoadFaveRestaurants).toHaveBeenCalled();
  });

  test("Restaurant name, address, and cuisine are displayed", async () => {
    renderComponent();

    // Check first restaurant
    expect(await screen.findByText("Test Restaurant 1")).toBeInTheDocument();
    expect(screen.getByText(/4.5\/5/i)).toBeInTheDocument();

    // Check second restaurant
    expect(screen.getByText("Sakura Sushi")).toBeInTheDocument();
    expect(screen.getByText(/4.0\/5/i)).toBeInTheDocument();
    
  });

  test("Count of total favourite restaurants is displayed", async () => {
    renderComponent();

    expect(await screen.findByText(/2 favourite restaurants/i)).toBeInTheDocument();
  });

  test("A message saying the user has no favourites is shown if the user has not favourited any restaurants", async () => {
    mockLoadFaveRestaurants = jest.fn();
    setFaveRestaurants = jest.fn();

    renderWithDealsProvider(
      <FavouriteRestaurantList
        uuid={1}
        loadFaveRestaurants={mockLoadFaveRestaurants}
        faveRestaurants={[]}
        setFaveRestaurants={setFaveRestaurants}
      />
    );

    expect(await screen.findByText(/No restaurants favourited./i)).toBeInTheDocument();
  });
});