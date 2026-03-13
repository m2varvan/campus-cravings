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

});
