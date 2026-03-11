import { render, screen, fireEvent } from "@testing-library/react";
import HelpfulReview from "./HelpfulReview";

test("increments helpful vote when clicked", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={{id:"1"}} />
  );

  const button = screen.getByText(/Helpful/);

  fireEvent.click(button);

  expect(await screen.findByText("👍 Helpful (3)")).toBeInTheDocument();
});

test("prevents double voting", async () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={{id:"1"}} />
  );

  const button = screen.getByText(/Helpful/);

  fireEvent.click(button);
  fireEvent.click(button);

  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("blocks helpful vote when not logged in", () => {

  render(
    <HelpfulReview reviewID={1} helpfulVotes={2} user={null} />
  );

  const button = screen.getByText(/Helpful/);

  fireEvent.click(button);

  expect(screen.getByText(/Login required/)).toBeInTheDocument();
});