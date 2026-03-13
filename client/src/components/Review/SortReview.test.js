import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ReviewSort from "./ReviewSort";

test("renders sort select", () => {
  render(<ReviewSort sortType="newest" setSortType={() => {}} />);
  const combo = screen.getByRole("combobox");
  expect(combo).toBeInTheDocument();
});

