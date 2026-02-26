const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require("@testing-library/react");
require("@testing-library/jest-dom");
const React = require("react");
const Restaurant = require("./Restaurant").default;

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

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function renderComponent(props = {}) {
    return render(
      React.createElement(Restaurant, {
        uuid: null,
        restaurant: mockRestaurant,
        isOpen: false,
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
      React.createElement(Restaurant, {
        uuid: null,
        restaurant: undefined,
        isOpen: false,
      }),
    );
    expect(container.firstChild).toBeNull();
  });

  test("opens RestaurantDetails dialog when card is clicked", async () => {
    renderComponent();
    const card = screen.getByTestId(
      `expand-restaurantID-${mockRestaurant.restaurant_id}`,
    );
    fireEvent.click(card);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("renders with dialog already open when isOpen is true", async () => {
    renderComponent({ isOpen: true });
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("closes dialog when Close button is clicked", async () => {
    renderComponent();

    const card = screen.getByTestId(
      `expand-restaurantID-${mockRestaurant.restaurant_id}`,
    );
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
