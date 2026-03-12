import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import HelpfulReview from "./HelpfulReview";

test("increments helpful vote when clicked", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ voted: true })
    })
  );

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={{id:"1"}} />
  );

  const button = screen.getByLabelText(/helpful review/i);

  await act(async () => {
    fireEvent.click(button);
  });

  // after clicking, count should increment to 3
  await waitFor(() => expect(screen.getByText("3")).toBeInTheDocument());
});

test("clicking multiple times sends multiple requests", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ voted: true })
    })
  );

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={{id:"1"}} />
  );

  const button = screen.getByLabelText(/helpful review/i);

  fireEvent.click(button);
  fireEvent.click(button);

  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("blocks helpful vote when not logged in", () => {

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={null} />
  );

  const button = screen.getByLabelText(/helpful review/i);

  fireEvent.click(button);

  expect(screen.getByText(/You must be logged in/i)).toBeInTheDocument();
});