import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewDeal from "./ReviewDeal";

describe("ReviewDeal", () => {

    test("shows error if user not logged in", async () => {

        render(
            <ReviewDeal 
                dealID={1}
                uuid={null}
                reloadReviews={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText(/submit review/i));

        expect(
            screen.getByText(/must be logged in/i)
        ).toBeInTheDocument();
    });

});