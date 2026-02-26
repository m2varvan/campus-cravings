const {
  render,
  screen,
  fireEvent,
  waitFor,
} = require("@testing-library/react");
require("@testing-library/jest-dom");
const React = require("react");
const RestaurantDetails = require("./RestaurantDetails").default;

jest.mock("../Deals/ExpandedDeal", () => () => null);

describe("RestaurantDetails", () => {
  const mockRestaurantDetails = {
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
      dealName: "Lunch Special",
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

  const mockRatings = {
    total_ratings: 2,
    avg_value_score: "4.50",
    avg_taste_score: "4.00",
    avg_portion_score: "3.75",
  };

  let handleClose;

  function buildFetchMock({
    details = mockRestaurantDetails,
    hours = [],
    ratings = {},
    deals = [],
  } = {}) {
    return jest.fn((url) => {
      if (url === "/api/restaurant-info")
        return Promise.resolve({ ok: true, json: () => Promise.resolve(details) });
      if (url === "/api/restaurant-hours")
        return Promise.resolve({ ok: true, json: () => Promise.resolve(hours) });
      if (url === "/api/restaurant-rating")
        return Promise.resolve({ ok: true, json: () => Promise.resolve(ratings) });
      if (url === "/api/restaurant-deals")
        return Promise.resolve({ ok: true, json: () => Promise.resolve(deals) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  }

  function renderComponent(props = {}) {
    handleClose = jest.fn().mockName("handleClose");
    return render(
      React.createElement(RestaurantDetails, {
        restaurant_id: 1,
        uuid: "test-uuid",
        open: true,
        handleClose,
        ...props,
      }),
    );
  }

  afterEach(() => {
    jest.resetAllMocks();
  });


  test("shows loading message while data is being fetched", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Loading restaurant details/i)).toBeInTheDocument();
  });

  test("shows error message when one or more API requests fail", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API failure"));
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load restaurant details/i),
      ).toBeInTheDocument();
    });
  });


  test("displays restaurant name", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    });
  });

  test("displays address details", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("Waterloo, ON")).toBeInTheDocument();
      expect(screen.getByText("N2L 3G1")).toBeInTheDocument();
    });
  });

  test("displays phone number when available", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("519-555-1234")).toBeInTheDocument();
    });
  });

  test('displays "Information is not available" when phone number is missing', async () => {
    global.fetch = buildFetchMock({ details: mockRestaurantNoOptionals });
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getAllByText(/Information is not available/i)[0],
      ).toBeInTheDocument();
    });
  });

  test("displays website link when available", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /visit official website/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://testrestaurant.com");
    });
  });

  test("does not display website link when website_url is missing", async () => {
    global.fetch = buildFetchMock({ details: mockRestaurantNoOptionals });
    renderComponent();
    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: /visit official website/i }),
      ).not.toBeInTheDocument();
    });
  });

  test("displays cuisine when available", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Italian/i)).toBeInTheDocument();
    });
  });

  test('displays "Information is not available" when cuisine is empty', async () => {
    global.fetch = buildFetchMock({ details: mockRestaurantNoOptionals });
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getAllByText(/Information is not available/i)[0],
      ).toBeInTheDocument();
    });
  });


  test("calls handleClose when Close button is clicked", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });


  test('shows "No hours available" when hours list is empty', async () => {
    global.fetch = buildFetchMock({ hours: [] });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No hours available/i)).toBeInTheDocument();
    });
  });

  test("displays restaurant hours correctly when loaded", async () => {
    global.fetch = buildFetchMock({ hours: mockHours });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Monday:/i)).toBeInTheDocument();
      expect(screen.getByText(/Tuesday:/i)).toBeInTheDocument();
    });
  });


  test('shows "No ratings yet" when there are no ratings', async () => {
    global.fetch = buildFetchMock({ ratings: { total_ratings: 0 } });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No ratings yet/i)).toBeInTheDocument();
    });
  });

  test("displays ratings when available", async () => {
    global.fetch = buildFetchMock({ ratings: mockRatings });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Value:/i)).toBeInTheDocument();
      expect(screen.getByText(/Taste:/i)).toBeInTheDocument();
      expect(screen.getByText(/Portion:/i)).toBeInTheDocument();
    });
  });


  test('shows "No deals available" when there are no deals', async () => {
    global.fetch = buildFetchMock({ deals: [] });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/No deals available/i)).toBeInTheDocument();
    });
  });

  test("displays deal name when deals are loaded", async () => {
    global.fetch = buildFetchMock({ deals: mockDeals });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Lunch Special")).toBeInTheDocument();
    });
  });

  test('shows "View Details" link for each deal', async () => {
    global.fetch = buildFetchMock({ deals: mockDeals });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    });
  });


  test("displays Added on and Last updated date labels", async () => {
    global.fetch = buildFetchMock();
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Added on:/i)).toBeInTheDocument();
      expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
    });
  });
});