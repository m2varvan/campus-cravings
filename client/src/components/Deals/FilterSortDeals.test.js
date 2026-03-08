
import { render, screen, fireEvent, within} from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import Deals from "./index";

describe("Deals Filtering and Sorting", () => {

    const deal1 = {
        dealID: 1,
        dealName: 'Lunch Special',
        dealDescription: 'Choice of Veg of Chicken Dish Comes with Steam Rice Upgrade to Egg Fried Rice/Egg Noodles fo $1.99',
        dealPrice: '10.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '1',
        restaurantName: 'Hakka Nation',
        dayOfWeek: 'Monday',
        startTime: '11:30:00',
        endTime: '16:00:00',
        numRatings: 0,
        dealTasteRating: 5,
        dealPortionRating: 5,
        dealValueRating: 5,
    };
    const deal2 = {
        dealID: 2,
        dealName: 'Sandwhich Specials',
        dealDescription: 'Sandwhich & Bubble tea combo Your choice of regular size bubble tea and fresh made panini (blueberry brie, bacon and apple butter brie, beef cheddar n onion, spinach dip) add $2 for large size',
        dealPrice: '15.00',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '5',
        restaurantName: 'Sweet Dreams Teashop',
        dayOfWeek: 'Monday',
        startTime: '11:00:00',
        endTime: '14:00:00',
        numRatings: 0,
        dealTasteRating: 2,
        dealPortionRating: 2,
        dealValueRating: 2,
    };
    const deal3 = {
        dealID: 20,
        dealName: 'Promo Special',
        dealDescription: '',
        dealPrice: '19.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '33',
        restaurantName: 'Baba Grill',
        dayOfWeek: 'Monday',
        startTime: '11:00:00',
        endTime: '21:00:00',
        numRatings: 0,
        dealTasteRating: 5,
        dealPortionRating: 4,
        dealValueRating: 5,
    };

    const todayDeals = [deal1, deal2, deal3];
    const weekDeals = { Monday: [deal1, deal2, deal3] };

    beforeAll(() => {
        global.fetch = jest.fn((url) => {
            if (url.includes("/api/today/deals")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(todayDeals),
            });
            } else if (url.includes("/api/week/deals")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(weekDeals),
            });
            }
            return Promise.reject(new Error("Unknown API endpoint"));
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    // Render Deals component and wait for deals to load, return references to select boxes and clear button
    const renderDeals= async () => {
        render(<Deals uuid={null} />);
        
        // Wait for the first deal to appear
        const deal1 = await screen.findAllByText("Lunch Special");
        expect(deal1.length).toBeGreaterThan(0); // at least one

        const restaurantDropdown = screen.getByTestId("restaurant-filter");
        const ratingDropdown = screen.getByTestId('rating-sort');
        const clearButton = screen.getByTestId('clear-filters');

        return { restaurantDropdown, ratingDropdown, clearButton };
    }

    test("filters deals by restaurant name", async () => {
        const { restaurantDropdown } = await renderDeals();

        // Open the dropdown
        fireEvent.mouseDown(restaurantDropdown.querySelector('[role="combobox"]'));

        // listbox should appear in the DOM
        const listbox = await screen.findByRole("listbox");

        // Click the option
        const hakkaOption = within(listbox).getByText("Hakka Nation");
        fireEvent.click(hakkaOption);

        const deal1 = await screen.findAllByText("Lunch Special");
        expect(deal1.length).toBeGreaterThan(0); // at least one

        expect(screen.queryByText("Promo Special")).not.toBeInTheDocument();
        expect(screen.queryByText("Sandwhich Specials")).not.toBeInTheDocument();
    });

    test.skip("sorts deals by highest rating first", async () => {
        const { ratingDropdown } = await renderDeals();

        // Open the dropdown
        fireEvent.mouseDown(ratingDropdown.querySelector('[role="combobox"]'));

        // listbox should appear in the DOM
        const listbox = await screen.findByRole("listbox");

        // Click the option
        const hakkaOption = within(listbox).getByText("Highest to Lowest");
        fireEvent.click(hakkaOption);

        // Get all elements with deal-name tag
        const dealsContainer = screen.getByTestId("today-deals"); // parent of all deals
        const dealNameElements = within(dealsContainer).getAllByTestId("deal-name");
        
        // Map textContent
        const dealNames = dealNameElements.map(el => el.textContent.trim());

        // Assert exact order
        expect(dealNames).toEqual([
            "Lunch Special",
            "Promo Special",
            "Sandwhich Specials"
        ]);
    });

    test.skip("sorts deals by lowest rating first", async () => {
        const { ratingDropdown } = await renderDeals();

        // Open the dropdown
        fireEvent.mouseDown(ratingDropdown.querySelector('[role="combobox"]'));

        // listbox should appear in the DOM
        const listbox = await screen.findByRole("listbox");

        // Click the option
        const hakkaOption = within(listbox).getByText("Highest to Lowest");
        fireEvent.click(hakkaOption);


        const dealsContainer = screen.getByTestId("today-deals"); // parent of all deals
        const dealNameElements = within(dealsContainer).getAllByTestId("deal-name");
        
        // Map textContent
        const dealNames = dealNameElements.map(el => el.textContent.trim());

        // Assert exact order
        expect(dealNames).toEqual([
            "Sandwhich Specials",
            "Promo Special",
            "Lunch Special"
        ]);
    });


    test("clears filters and shows all deals", async () => {
        const { restaurantDropdown, clearButton } = await renderDeals();

        // Open the dropdown
        fireEvent.mouseDown(restaurantDropdown.querySelector('[role="combobox"]'));

        // listbox should appear in the DOM
        const listbox = await screen.findByRole("listbox");

        // Click the option
        const hakkaOption = within(listbox).getByText("Hakka Nation");
        fireEvent.click(hakkaOption);

        const deal1 = await screen.findAllByText("Lunch Special");
        expect(deal1.length).toBeGreaterThan(0); // at least one

        expect(screen.queryByText("Promo Special")).not.toBeInTheDocument();
        expect(screen.queryByText("Sandwhich Specials")).not.toBeInTheDocument();


        // Clear filters
        fireEvent.click(clearButton);

        const deal3 = await screen.findAllByText("Lunch Special");
        expect(deal3.length).toBeGreaterThan(0); // at least one
        const deal4 = await screen.findAllByText("Promo Special");
        expect(deal4.length).toBeGreaterThan(0); // at least one
        const deal5 = await screen.findAllByText("Sandwhich Specials");
        expect(deal5.length).toBeGreaterThan(0); // at least one
  
    });
});