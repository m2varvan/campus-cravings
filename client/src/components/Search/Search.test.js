import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
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

describe("SearchPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("displays no-results messages when search returns empty", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ restaurants: [], deals: [] }),
    });

    renderWithQuery("nothing");

    await waitFor(() => expect(screen.getByText(/No restaurants found/)).toBeInTheDocument());
    expect(screen.getByText(/No deals found/)).toBeInTheDocument();
  });

  test("renders restaurant and deal cards from search results", async () => {
    // first call: search
    global.fetch.mockImplementation((url) => {
      if (url.startsWith("/api/search")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            restaurants: [{ restaurant_id: 1, restaurant_name: "R1" }],
            deals: [{ deal_id: 10, restaurant_id: 1 }],
          }),
        });
      }
      if (url.startsWith("/api/get-restaurants")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ restaurant_id: 1, is_favourited: true }]),
        });
      }
      if (url.startsWith("/api/restaurant-deals")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                dealID: 10,
                dealName: "Deal1",
                dealPrice: 5,
                restaurant_name: "R1",
                dealValueRating: 0,
                dealPortionRating: 0,
                dealTasteRating: 0,
                number_of_ratings: 0,
                totalVote: 1,
                userVote: 0,
                daysOfWeek: ["Monday"],
              },
            ]),
        });
      }
      if (url.startsWith("/api/week/deals")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ Monday: [{ dealID: 10, fave: true }] }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    renderWithQuery("something");

    // restaurant card should be rendered
    expect(await screen.findByTestId("expand-restaurantID-1")).toBeInTheDocument();
    // deal card should be rendered
    expect(await screen.findByTestId("expand-dealID-10")).toBeInTheDocument();
  });
});
