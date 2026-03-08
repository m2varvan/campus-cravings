import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Deals from "./index";

// Mock child components
jest.mock("./TodayDeal", () => (props) => (
  <div data-testid="today-deals">
    {props.todayDeals.length
      ? props.todayDeals.map((d) => <div key={d.dealID}>{d.dealName}</div>)
      : <div>No deals found</div>}
  </div>
));

jest.mock("./WeekDeal", () => (props) => (
  <div data-testid="week-deals">
    {Object.values(props.weekDeals || {}).flat().length
      ? Object.values(props.weekDeals).flat().map((d) => <div key={d.dealID}>{d.dealName}</div>)
      : <div>No deals found</div>}
  </div>
));

describe("Deals Filtering and Sorting", () => {

    const deal1 = { dealID: 1, dealName: "Lunch Special", restaurantName: "Hakka Nation", dealTasteRating: 5, dealPortionRating: 5, dealValueRating: 5 };
    const deal2 = { dealID: 2, dealName: "Sandwhich Specials", restaurantName: "Sweet Dreams Teashop", dealTasteRating: 2, dealPortionRating: 2, dealValueRating: 2 };
    const deal3 = { dealID: 3, dealName: "Promo Special", restaurantName: "Hakka Nation", dealTasteRating: 4, dealPortionRating: 4, dealValueRating: 4 };

    const todayDeals = [deal1, deal2, deal3];
    const weekDeals = { Monday: [deal1, deal2, deal3] };

    // Mock return data to mimick API
    beforeEach(() => {
        global.fetch = jest.fn((url) =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(url.includes("today") ? todayDeals : weekDeals)
        })
        );
    });

    // Render Deals component and wait for deals to load, return references to select boxes and clear button
    const renderDeals= async () => {
        render(<Deals uuid={null} />);
        // Wait for the first deal to appear
        await screen.findByText("Lunch Special");

        const restaurantDropdown = screen.getByRole("combobox", { name: /restaurant/i });
        const ratingDropdown = screen.getByRole("combobox", { name: /rating sort/i });
        const clearButton = screen.getByRole("button", { name: /clear/i });

        return { restaurantDropdown, ratingDropdown, clearButton };
    }

    test("filters deals by restaurant name", async () => {
        const { restaurantDropdown } = await renderDeals();

        fireEvent.change(restaurantDropdown, { target: { value: "Hakka Nation" } });

        expect(screen.getByText("Lunch Special")).toBeInTheDocument();
        expect(screen.getByText("Promo Special")).toBeInTheDocument();
        expect(screen.queryByText("Sandwhich Specials")).not.toBeInTheDocument();
    });

    test("sorts deals by highest rating first", async () => {
        const { ratingDropdown } = await renderDeals();

        fireEvent.change(ratingDropdown, { target: { value: "Highest to Lowest" } });

        const deals = screen.getAllByTestId("today-deals")[0];
        const dealNames = deals.querySelectorAll("div");

        expect(dealNames[0]).toHaveTextContent("Lunch Special");
        expect(dealNames[1]).toHaveTextContent("Promo Special");
        expect(dealNames[2]).toHaveTextContent("Sandwhich Specials");
    });

    test("sorts deals by lowest rating first", async () => {
        const { ratingDropdown } = await renderDeals();

        fireEvent.change(ratingDropdown, { target: { value: "Lowest" } });

        const deals = screen.getAllByTestId("today-deals")[0];
        const dealNames = deals.querySelectorAll("div");

        expect(dealNames[0]).toHaveTextContent("Sandwhich Specials");
        expect(dealNames[1]).toHaveTextContent("Promo Special");
        expect(dealNames[2]).toHaveTextContent("Lunch Special");
    });

    test("shows 'No deals found' when no matches exist", async () => {
        const { restaurantDropdown } = await renderDeals();

        fireEvent.change(restaurantDropdown, { target: { value: "Nonexistent Restaurant" } });

        expect(screen.getByText("No deals found")).toBeInTheDocument();
    });

    test("clears filters and shows all deals", async () => {
        const { restaurantDropdown, clearButton } = await renderDeals();

        // Apply a filter
        fireEvent.change(restaurantDropdown, { target: { value: "Hakka Nation" } });
        expect(screen.getByText("Lunch Special")).toBeInTheDocument();
        expect(screen.getByText("Promo Special")).toBeInTheDocument();
        expect(screen.queryByText("Sandwhich Specials")).not.toBeInTheDocument();

        // Clear filters
        fireEvent.click(clearButton);

        expect(screen.getByText("Lunch Special")).toBeInTheDocument();
        expect(screen.getByText("Promo Special")).toBeInTheDocument();
        expect(screen.getByText("Sandwhich Specials")).toBeInTheDocument();
    });
});