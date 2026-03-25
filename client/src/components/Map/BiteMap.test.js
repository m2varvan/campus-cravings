import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import BiteMap from "./BiteMap";

// tell jest to ignore the image files so it doesn't cause syntax errors
jest.mock("leaflet/dist/leaflet.css", () => {});
jest.mock("leaflet/dist/images/marker-icon-2x.png", () => "");
jest.mock("leaflet/dist/images/marker-icon.png", () => "");
jest.mock("leaflet/dist/images/marker-shadow.png", () => "");

// react-leaflet components to avoid crash when rendering map in JSDOM
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
  Tooltip: ({ children }) => <div data-testid="tooltip">{children}</div>,
}));

// mock function of RestaurantDetails component
jest.mock("../Restaurant/RestaurantDetails", () => {
  return function MockRestaurantDetails({ restaurant_id, open }) {
    return open ? (
      <div data-testid="mock-restaurant-details">
        Showing details for {restaurant_id}
      </div>
    ) : null;
  };
});

describe("BiteMap", () => {
  const mockRestaurants = [
    {
      id: 1,
      name: "Campus Pizza",
      lat: 43.47261643699509,
      lng: -80.53802660322124,
    },
    {
      id: 2,
      name: "Lazeez Shawarma",
      lat: 43.47256626243004,
      lng: -80.53871520137221,
    },
    {
      id: 3,
      name: "Sweet Dreams Teashop",
      lat: 43.47205285544373,
      lng: -80.5391882849798,
    },
  ];

  function renderComponent(props = {}) {
    render(<BiteMap uuid="test-user-id" {...props} />);
  }

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("displays loading message on initial render", async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText(/Loading interactive map.../i)).toBeInTheDocument();
  });

  test("displays error message if map data fails to load", async () => {
    fetch.mockRejectedValueOnce(new Error("API Down"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while loading the map data/i),
      ).toBeInTheDocument();
    });
  });

  test("displays empty message if no restaurants exist in the area", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/No restaurants available in this area right now/i),
      ).toBeInTheDocument();
    });
  });

  test("renders map and displays restaurant markers when data loads successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRestaurants,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("map-container")).toBeInTheDocument();

      mockRestaurants.forEach((restaurant) => {
        const names = screen.getAllByText(restaurant.name);
        expect(names.length).toBeGreaterThan(0);
      });
    });
  });

  test('opens RestaurantDetails component with correct ID when "View Full Details" is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRestaurants,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText(/View Full Details/i);

    fireEvent.click(viewButtons[0]);

    expect(screen.getByTestId("mock-restaurant-details")).toBeInTheDocument();
    expect(screen.getByText("Showing details for 1")).toBeInTheDocument();
  });
});
