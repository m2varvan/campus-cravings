const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require("@testing-library/react");
require("@testing-library/jest-dom");
const React = require("react");
const Restaurant = require("./Restaurant").default;

jest.mock("./RestaurantDetails", () => {
  const mockReact = require("react");
  return function MockRestaurantDetails({ open, handleClose }) {
    if (!open) return null;
    return mockReact.createElement(
      "div",
      { role: "dialog" },
      mockReact.createElement("button", { onClick: handleClose }, "Close"),
    );
  };
});

describe("Restaurant", () => {
  const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: "Test Restaurant",
    street_address: "123 Main St",
    unit: null,
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3G1",
    phone_number: "519-555-1234",
    website_url: "https://testrestaurant.com",
    cuisine: "Italian",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  function renderComponent(props = {}) {
    return render(
      React.createElement(Restaurant, {
        uuid: null,
        restaurant: mockRestaurant,
        ...props,
      }),
    );
  }

  test("displays the restaurant name on the card", () => {
    renderComponent();
    expect(
      screen.getByText(mockRestaurant.restaurant_name),
    ).toBeInTheDocument();
  });

  test("returns null if restaurant is undefined", () => {
    const { container } = render(
      React.createElement(Restaurant, { uuid: null, restaurant: undefined }),
    );
    expect(container.firstChild).toBeNull();
  });

  test("dialog is not visible before card is clicked", () => {
    renderComponent();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test.only("opens RestaurantDetails dialog when card is clicked", async () => {
    renderComponent();
    fireEvent.click(
      screen.getByTestId(`expand-restaurantID-${mockRestaurant.restaurant_id}`),
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("closes dialog when Close button is clicked", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByTestId(`expand-restaurantID-${mockRestaurant.restaurant_id}`),
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
