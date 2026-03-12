import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import FilterSortRestaurants from "./FilterSortRestaurants";

describe("FilterSortRestaurants Component", () => {
  const mockSetRestaurantFilter = jest.fn();
  const mockSetCuisineFilter = jest.fn();
  const mockSetRatingSort = jest.fn();
  const mockSetOpenNowFilter = jest.fn();

  const defaultProps = {
    restaurantFilter: [],
    setRestaurantFilter: mockSetRestaurantFilter,
    cuisineFilter: [],
    setCuisineFilter: mockSetCuisineFilter,
    ratingSort: "",
    setRatingSort: mockSetRatingSort,
    openNowFilter: false,
    setOpenNowFilter: mockSetOpenNowFilter,
    restaurantOptions: [
      "Hakka Nation",
      "Indian Sweet Master",
      "Izna Poke Plus",
    ],
    cuisineOptions: ["Chinese / Indian", "Indian", "Japanese"],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderFilters = async (props = defaultProps) => {
    render(<FilterSortRestaurants {...props} />);

    const restaurantDropdown = screen.getByLabelText(/Filter by Restaurant/i).closest('.MuiInputBase-root');
    const cuisineDropdown = screen.getByLabelText(/Filter by Cuisine/i).closest('.MuiInputBase-root');
    const ratingDropdown = screen.getByLabelText(/Sort by Category/i).closest('.MuiInputBase-root');
    
    const openNowToggle = screen.getByRole("checkbox", { name: /Open Now/i });
    
    const clearButton = screen.getByRole("button", { name: /Reset All/i });

    return {
      restaurantDropdown,
      cuisineDropdown,
      ratingDropdown,
      openNowToggle,
      clearButton,
    };
  };

  test("renders all filtering and sorting inputs on the screen", async () => {
    const {
      restaurantDropdown,
      cuisineDropdown,
      ratingDropdown,
      openNowToggle,
      clearButton,
    } = await renderFilters();

    expect(restaurantDropdown).toBeInTheDocument();
    expect(cuisineDropdown).toBeInTheDocument();
    expect(ratingDropdown).toBeInTheDocument();
    expect(openNowToggle).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  test("dropdowns populate with correct options from props", async () => {
    const { restaurantDropdown } = await renderFilters();

    fireEvent.mouseDown(within(restaurantDropdown).getByRole("combobox"));

    const listbox = await screen.findByRole("listbox");

    expect(within(listbox).getByText("Hakka Nation")).toBeInTheDocument();
    expect(within(listbox).getByText("Indian Sweet Master")).toBeInTheDocument();
    expect(within(listbox).getByText("Izna Poke Plus")).toBeInTheDocument();
  });

  test("filters by a specific restaurant name", async () => {
    const { restaurantDropdown } = await renderFilters();

    fireEvent.mouseDown(within(restaurantDropdown).getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");

    const hakkaOption = within(listbox).getByText("Hakka Nation");
    fireEvent.click(hakkaOption);

    expect(mockSetRestaurantFilter).toHaveBeenCalled();
  });

  test("filters by a specific cuisine type", async () => {
    const { cuisineDropdown } = await renderFilters();

    fireEvent.mouseDown(within(cuisineDropdown).getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");

    const japaneseOption = within(listbox).getByText("Japanese");
    fireEvent.click(japaneseOption);

    expect(mockSetCuisineFilter).toHaveBeenCalled();
  });

  test("sorts restaurants by 'Taste' rating category", async () => {
    const { ratingDropdown } = await renderFilters();

    fireEvent.mouseDown(within(ratingDropdown).getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");

    const tasteOption = within(listbox).getByText("Taste");
    fireEvent.click(tasteOption);

    expect(mockSetRatingSort).toHaveBeenCalledWith("taste");
  });

  test("toggles the 'Open Now' filter switch", async () => {
    const { openNowToggle } = await renderFilters();

    fireEvent.click(openNowToggle);

    expect(mockSetOpenNowFilter).toHaveBeenCalledWith(true);
  });

  test("clears filters and resets all states back to default", async () => {
    const { clearButton } = await renderFilters();

    fireEvent.click(clearButton);

    expect(mockSetRestaurantFilter).toHaveBeenCalledWith([]);
    expect(mockSetCuisineFilter).toHaveBeenCalledWith([]);
    expect(mockSetRatingSort).toHaveBeenCalledWith("");
    expect(mockSetOpenNowFilter).toHaveBeenCalledWith(false);
  });
});