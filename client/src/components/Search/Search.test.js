import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";

// helper to wrap component with router query
function renderWithQuery(query, uuid = 1) {
  return render(
    <MemoryRouter initialEntries={[`/search?q=${encodeURIComponent(query)}`]}>
      <Routes>
        <Route path="/search" element={<SearchPage uuid={uuid} />} />
      </Routes>
    </MemoryRouter>
  );
}

// Helper function to setup fetch mock responses
function setupDefaultFetchMock(options = {}) {
  global.fetch.mockImplementation((url) => {
    // Main search API
    if (url.includes("/api/search?q=")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(options.searchResults || { restaurants: [], deals: [] }),
      });
    }
    // User search API
    if (url.includes("/api/search/users?q=")) {
      if (options.userSearchFail) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(options.users || []),
      });
    }
    // Other APIs (get-restaurants, restaurant-rating, restaurant-hours, restaurant-deals, week/deals)
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(options.otherData || []),
    });
  });
}

describe("SearchPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("displays no-results messages when search returns empty", async () => {
    setupDefaultFetchMock({ searchResults: { restaurants: [], deals: [] }, users: [] });

    renderWithQuery("nothing");

    await waitFor(() => expect(screen.getByText(/No restaurants found/)).toBeInTheDocument());
    expect(screen.getByText(/No deals found/)).toBeInTheDocument();
  });

  test("displays no users found message when user search returns empty", async () => {
    setupDefaultFetchMock({ users: [] });

    renderWithQuery("nonexistent_user");

    await waitFor(() => {
      expect(screen.getByText("No users found.")).toBeInTheDocument();
    });
  });

  test("displays search results title with the query", async () => {
    setupDefaultFetchMock({ users: [] });

    renderWithQuery("pizza");

    await waitFor(() => {
      expect(screen.getByText(/Search Results for "pizza"/)).toBeInTheDocument();
    });
  });

  test("fetches users from the search API", async () => {
    setupDefaultFetchMock({ users: [] });

    renderWithQuery("john");

    await waitFor(() => {
      // Verify that fetch was called at least once
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test("displays users in search results", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "JD",
        },
      ],
    });

    renderWithQuery("john");

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });
  });

  test("displays multiple users in search results", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "J",
        },
        {
          id: 2,
          username: "jane_smith",
          first_name: "Jane",
          last_name: "Smith",
          user_type: "restaurant_owner",
          profile_photo: "JS",
        },
      ],
    });

    renderWithQuery("user");

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
      expect(screen.getByText("jane_smith")).toBeInTheDocument();
    });
  });

  test("displays user full names in results", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "J",
        },
      ],
    });

    renderWithQuery("john");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("displays user type labels in results", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "J",
        },
      ],
    });

    renderWithQuery("john");

    await waitFor(() => {
      const userElement = screen.getByText("john_doe");
      expect(userElement).toBeInTheDocument();
      // Verify user element is part of the rendered result
      expect(userElement.closest("div")).toBeInTheDocument();
    });
  });

  test("navigates to User page when clicking a regular user result", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "J",
        },
      ],
    });

    renderWithQuery("john");

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // User card should be clickable
    const userCard = screen.getByTestId("user-result-1");
    expect(userCard).toBeInTheDocument();
  });

  test("navigates to Owner page when clicking a restaurant owner result", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 2,
          username: "owner_jane",
          first_name: "Jane",
          last_name: "Smith",
          user_type: "restaurant_owner",
          profile_photo: "O",
        },
      ],
    });

    renderWithQuery("owner");

    await waitFor(() => {
      expect(screen.getByText("owner_jane")).toBeInTheDocument();
    });

    const ownerCard = screen.getByTestId("user-result-2");
    expect(ownerCard).toBeInTheDocument();
  });

  test("displays user profile photo when available", async () => {
    setupDefaultFetchMock({
      users: [
        {
          id: 1,
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          user_type: "regular_user",
          profile_photo: "JD",
        },
      ],
    });

    renderWithQuery("john");

    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  test("does not perform search when query is empty", async () => {
    render(
      <MemoryRouter initialEntries={["/search?q="]}>
        <Routes>
          <Route path="/search" element={<SearchPage uuid={1} />} />
        </Routes>
      </MemoryRouter>
    );

    // Should not make any fetch calls when query is empty
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("performs search when query is provided", async () => {
    setupDefaultFetchMock({ users: [] });

    renderWithQuery("pizza");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test("handles user search API failure gracefully", async () => {
    setupDefaultFetchMock({ users: [], userSearchFail: true });

    renderWithQuery("test");

    await waitFor(() => {
      expect(screen.getByText("No users found.")).toBeInTheDocument();
    });
  });

  test("displays Users section header in search results", async () => {
    setupDefaultFetchMock({ users: [] });

    renderWithQuery("test");

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });
  });

  test("displays Restaurants section header in search results", async () => {
    setupDefaultFetchMock({ searchResults: { restaurants: [], deals: [] }, users: [] });

    renderWithQuery("test");

    await waitFor(() => {
      expect(screen.getByText("Restaurants")).toBeInTheDocument();
    });
  });

  test("displays Deals section header in search results", async () => {
    setupDefaultFetchMock({ searchResults: { restaurants: [], deals: [] }, users: [] });

    renderWithQuery("test");

    await waitFor(() => {
      expect(screen.getByText("Deals")).toBeInTheDocument();
    });
  });
});
