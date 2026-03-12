import { render, screen, fireEvent } from "@testing-library/react";
import ReviewSort from "./ReviewSort";

test("changes sort type", () => {

  const setSortType = jest.fn();

  render(
    <ReviewSort sortType="newest" setSortType={setSortType}/>
  );

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "mostHelpful" }
  });

  expect(setSortType).toHaveBeenCalledWith("mostHelpful");
});