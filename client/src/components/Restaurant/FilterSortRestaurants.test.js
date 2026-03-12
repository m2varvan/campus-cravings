const { render, screen, fireEvent, within, waitFor } = require("@testing-library/react");
require("@testing-library/jest-dom");
const React = require("react");

const FilterSortRestaurants = ({
  restaurantFilter,
  setRestaurantFilter,
  cuisineFilter,
  setCuisineFilter,
  ratingSort,
  setRatingSort,
  openNowFilter,
  setOpenNowFilter,
  restaurantOptions = [],
  cuisineOptions = [],
}) => {
  const ratingOptions = [
    { label: "Default (A-Z)",   value: ""        },
    { label: "Overall Rating",  value: "overall" },
    { label: "Taste",           value: "taste"   },
    { label: "Value",           value: "value"   },
    { label: "Portion Size",    value: "portion" },
  ];

  return React.createElement(
    "div",
    null,

    React.createElement("label", { htmlFor: "restaurant-select" }, "Filter by Restaurant"),
    React.createElement(
      "select",
      {
        id: "restaurant-select",
        "data-testid": "restaurant-filter",
        multiple: true,
        value: restaurantFilter,
        onChange: (e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
          setRestaurantFilter(selected);
        },
      },
      restaurantOptions.map((name) =>
        React.createElement("option", { key: name, value: name }, name)
      )
    ),

    React.createElement("label", { htmlFor: "cuisine-select" }, "Filter by Cuisine"),
    React.createElement(
      "select",
      {
        id: "cuisine-select",
        "data-testid": "cuisine-filter",
        multiple: true,
        value: cuisineFilter,
        onChange: (e) => {
          const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
          setCuisineFilter(selected);
        },
      },
      cuisineOptions.map((name) =>
        React.createElement("option", { key: name, value: name }, name)
      )
    ),

    React.createElement("label", { htmlFor: "rating-select" }, "Sort by Category"),
    React.createElement(
      "select",
      {
        id: "rating-select",
        "data-testid": "rating-sort",
        value: ratingSort,
        onChange: (e) => setRatingSort(e.target.value),
      },
      ratingOptions.map(({ label, value }) =>
        React.createElement("option", { key: value, value }, label)
      )
    ),

    React.createElement(
      "label",
      null,
      React.createElement("input", {
        type: "checkbox",
        "data-testid": "open-now-filter",
        checked: openNowFilter,
        onChange: (e) => setOpenNowFilter(e.target.checked),
        "aria-label": "Open Now",
      }),
      "Open Now"
    ),

    React.createElement(
      "button",
      {
        "data-testid": "clear-filters",
        onClick: () => {
          setRestaurantFilter([]);
          setCuisineFilter([]);
          setRatingSort("");
          setOpenNowFilter(false);
        },
      },
      "Reset All"
    )
  );
};

describe("FilterSortRestaurants Component", () => {
  const mockSetRestaurantFilter = jest.fn();
  const mockSetCuisineFilter    = jest.fn();
  const mockSetRatingSort       = jest.fn();
  const mockSetOpenNowFilter    = jest.fn();

  const defaultProps = {
    restaurantFilter: [],
    setRestaurantFilter: mockSetRestaurantFilter,
    cuisineFilter: [],
    setCuisineFilter: mockSetCuisineFilter,
    ratingSort: "",
    setRatingSort: mockSetRatingSort,
    openNowFilter: false,
    setOpenNowFilter: mockSetOpenNowFilter,
    restaurantOptions: ["Hakka Nation", "Indian Sweet Master", "Izna Poke Plus"],
    cuisineOptions: ["Chinese / Indian", "Indian", "Japanese"],
  };

  afterEach(() => jest.clearAllMocks());

  const renderFilters = async (props = defaultProps) => {
    render(React.createElement(FilterSortRestaurants, props));

    const restaurantDropdown = await screen.findByTestId("restaurant-filter");
    const cuisineDropdown    = screen.getByTestId("cuisine-filter");
    const ratingDropdown     = screen.getByTestId("rating-sort");
    const openNowToggle      = screen.getByTestId("open-now-filter");
    const clearButton        = screen.getByTestId("clear-filters");

    return { restaurantDropdown, cuisineDropdown, ratingDropdown, openNowToggle, clearButton };
  };

  test("renders all filtering and sorting inputs on the screen", async () => {
    const { restaurantDropdown, cuisineDropdown, ratingDropdown, openNowToggle, clearButton } =
      await renderFilters();

    expect(restaurantDropdown).toBeInTheDocument();
    expect(cuisineDropdown).toBeInTheDocument();
    expect(ratingDropdown).toBeInTheDocument();
    expect(openNowToggle).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  test("dropdowns populate with correct options from props", async () => {
    const { restaurantDropdown } = await renderFilters();

    expect(within(restaurantDropdown).getByText("Hakka Nation")).toBeInTheDocument();
    expect(within(restaurantDropdown).getByText("Indian Sweet Master")).toBeInTheDocument();
    expect(within(restaurantDropdown).getByText("Izna Poke Plus")).toBeInTheDocument();
  });

  test("filters by a specific restaurant name", async () => {
    const { restaurantDropdown } = await renderFilters();

    restaurantDropdown.options[0].selected = true;
    fireEvent.change(restaurantDropdown);

    expect(mockSetRestaurantFilter).toHaveBeenCalled();
  });

  test("filters by a specific cuisine type", async () => {
    const { cuisineDropdown } = await renderFilters();

    cuisineDropdown.options[2].selected = true;
    fireEvent.change(cuisineDropdown);

    expect(mockSetCuisineFilter).toHaveBeenCalled();
  });

  test("sorts restaurants by 'Taste' rating category", async () => {
    const { ratingDropdown } = await renderFilters();

    fireEvent.change(ratingDropdown, { target: { value: "taste" } });

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