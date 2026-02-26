const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require("@testing-library/react");
require("@testing-library/jest-dom");
const React = require("react");
const RestaurantDetails = require("./RestaurantDetails").default;

describe("RestaurantDetails", () => {
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

  const mockRestaurantNoOptionals = {
    restaurant_id: 2,
    restaurant_name: "Minimal Restaurant",
    street_address: "456 Side St",
    unit: null,
    city: "Kitchener",
    province: "ON",
    postal_code: "N2G 1A1",
    phone_number: null,
    website_url: null,
    cuisine: "",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  };

  const mockDeals = [
    {
      deal_id: 10,
      deal_name: "Lunch Special",
      deal_price: 9.99,
      description: "A great lunch deal",
    },
  ];

  const mockHours = [
    {
      dayOfWeek: "Monday",
      startTimes: ["10:00", "14:00"],
      endTimes: ["12:00", "16:00"],
    },
    { dayOfWeek: "Tuesday", startTimes: ["11:00"], endTimes: ["15:00"] },
  ];

  const mockDealHours = {
    10: [
      {
        day_of_week: "Monday",
        start_times: "10:00,14:00",
        end_times: "12:00,16:00",
      },
    ],
  };

  let handleClose;

  function renderComponent(restaurant = mockRestaurant, props = {}) {
    handleClose = jest.fn().mockName("handleClose");
    return render(
      React.createElement(RestaurantDetails, {
        restaurant,
        open: true,
        handleClose,
        ...props,
      }),
    );
  }

  afterEach(() => {
    jest.resetAllMocks();
  });

  //displays basic info
  test("displays restaurant name", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    expect(
      screen.getByText(mockRestaurant.restaurant_name),
    ).toBeInTheDocument();
  });

  test("displays address details", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    expect(screen.getByText(mockRestaurant.street_address)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRestaurant.city}, ${mockRestaurant.province}`),
    ).toBeInTheDocument();
    expect(screen.getByText(mockRestaurant.postal_code)).toBeInTheDocument();
  });

  test("displays phone number when available", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    expect(screen.getByText(mockRestaurant.phone_number)).toBeInTheDocument();
  });

  test('displays "Information is not available" when phone number is missing', () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent(mockRestaurantNoOptionals);
    expect(
      screen.getAllByText(/Information is not available/i)[0],
    ).toBeInTheDocument();
  });

  test("displays website link when available", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    const link = screen.getByRole("link", { name: /visit official website/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", mockRestaurant.website_url);
  });

  test("does not display website link when website_url is missing", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent(mockRestaurantNoOptionals);
    expect(
      screen.queryByRole("link", { name: /visit official website/i }),
    ).not.toBeInTheDocument();
  });

  test("displays cuisine when available", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    expect(screen.getByText(/Italian/i)).toBeInTheDocument();
  });

  test('displays "Information is not available" when cuisine is empty', () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent(mockRestaurantNoOptionals);
    expect(
      screen.getAllByText(/Information is not available/i)[0],
    ).toBeInTheDocument();
  });

  //close button
  test("calls handleClose when Close button is clicked", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  //hours
  test("shows loading message while restaurant hours are loading", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Loading hours.../i)).toBeInTheDocument();
  });

  test("shows error message if restaurant hours fail to load", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API failure"));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Failed to load hours/i)).toBeInTheDocument();
    });
  });

  test('shows "No hours available" when restaurant hours list is empty', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No hours available/i)).toBeInTheDocument();
    });
  });

  test("displays restaurant hours correctly when loaded", async () => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/restaurant-hours") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHours),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Monday:/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00 - 12:00/)).toBeInTheDocument();
      expect(screen.getByText(/Tuesday:/i)).toBeInTheDocument();
      expect(screen.getByText(/11:00 - 15:00/)).toBeInTheDocument();
    });
  });

  //deals
  test('shows "No deals available" when there are no deals', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`No deals available at ${mockRestaurant.restaurant_name}`),
        ),
      ).toBeInTheDocument();
    });
  });

  test("displays deal name, price, and description when deals are loaded", async () => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/get-deals-by-restaurant") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDeals),
        });
      }
      if (url === "/api/deal-availability-by-restaurant") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDealHours),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Lunch Special")).toBeInTheDocument();
      expect(screen.getByText("$9.99")).toBeInTheDocument();
      expect(screen.getByText(/A great lunch deal/i)).toBeInTheDocument();
    });
  });

  test("displays deal availability hours when deal hours are loaded", async () => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/get-deals-by-restaurant") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDeals),
        });
      }
      if (url === "/api/deal-availability-by-restaurant") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDealHours),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Monday:/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00 - 12:00/)).toBeInTheDocument();
    });
  });

  test("shows deal fallback message when deal hours are missing", async () => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/get-deals-by-restaurant") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDeals),
        });
      }
      if (url === "/api/deal-availability-by-restaurant") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`No deals available at ${mockRestaurant.restaurant_name}`),
        ),
      ).toBeInTheDocument();
    });
  });

  //dates
  test("displays formatted created_at and updated_at date labels", () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderComponent();
    expect(screen.getByText(/Added on:/i)).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
  });
});
