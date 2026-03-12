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
    render(React.createElement(FilterSortRestaurants, props));

    const restaurantDropdown = screen.getByTestId("restaurant-filter");
    const cuisineDropdown = screen
      .getByLabelText(/Filter by Cuisine/i)
      .closest(".MuiFormControl-root");
    const ratingDropdown = screen.getByTestId("rating-sort");
    const openNowToggle = screen.getByLabelText("Open Now");
    const clearButton = screen.getByTestId("clear-filters");

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

    // Open the dropdown
    fireEvent.mouseDown(restaurantDropdown.querySelector('[role="combobox"]'));

    const listbox = await screen.findByRole("listbox");

    expect(within(listbox).getByText("Hakka Nation")).toBeInTheDocument();
    expect(
      within(listbox).getByText("Indian Sweet Master"),
    ).toBeInTheDocument();
    expect(within(listbox).getByText("Izna Poke Plus")).toBeInTheDocument();
  });

  test("filters by a specific restaurant name", async () => {
    const { restaurantDropdown } = await renderFilters();

    fireEvent.mouseDown(restaurantDropdown.querySelector('[role="combobox"]'));

    const listbox = await screen.findByRole("listbox");

    // Click the option
    const hakkaOption = within(listbox).getByText("Hakka Nation");
    fireEvent.click(hakkaOption);

    expect(mockSetRestaurantFilter).toHaveBeenCalledWith(["Hakka Nation"]);
  });

  test("filters by a specific cuisine type", async () => {
    const { cuisineDropdown } = await renderFilters();

    fireEvent.mouseDown(cuisineDropdown.querySelector('[role="combobox"]'));

    const listbox = await screen.findByRole("listbox");

    const japaneseOption = within(listbox).getByText("Japanese");
    fireEvent.click(japaneseOption);

    expect(mockSetCuisineFilter).toHaveBeenCalledWith(["Japanese"]);
  });

  test("sorts restaurants by 'Taste' rating category", async () => {
    const { ratingDropdown } = await renderFilters();

    fireEvent.mouseDown(ratingDropdown.querySelector('[role="combobox"]'));

    const listbox = await screen.findByRole("listbox");

    const tasteOption = within(listbox).getByText("Taste");
    fireEvent.click(tasteOption);

    expect(mockSetRatingSort).toHaveBeenCalledWith("taste");
  });

  test("sorts restaurants by 'Overall Rating' category", async () => {
    const { ratingDropdown } = await renderFilters();

    fireEvent.mouseDown(ratingDropdown.querySelector('[role="combobox"]'));

    const listbox = await screen.findByRole("listbox");

    const overallOption = within(listbox).getByText("Overall Rating");
    fireEvent.click(overallOption);

    expect(mockSetRatingSort).toHaveBeenCalledWith("overall");
  });

  test("toggles the 'Open Now' filter switch", async () => {
    const { openNowToggle } = await renderFilters();

    fireEvent.click(openNowToggle);

    expect(mockSetOpenNowFilter).toHaveBeenCalledWith(true);
  });

  test("clears filters and resets all states back to default", async () => {
    const { restaurantDropdown, clearButton } = await renderFilters();

    fireEvent.mouseDown(restaurantDropdown.querySelector('[role="combobox"]'));
    const listbox = await screen.findByRole("listbox");
    const hakkaOption = within(listbox).getByText("Hakka Nation");
    fireEvent.click(hakkaOption);

    expect(mockSetRestaurantFilter).toHaveBeenCalledWith(["Hakka Nation"]);

    fireEvent.click(clearButton);

    expect(mockSetRestaurantFilter).toHaveBeenCalledWith([]);
    expect(mockSetCuisineFilter).toHaveBeenCalledWith([]);
    expect(mockSetRatingSort).toHaveBeenCalledWith("");
    expect(mockSetOpenNowFilter).toHaveBeenCalledWith(false);
  });
});
