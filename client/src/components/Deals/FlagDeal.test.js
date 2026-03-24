import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FlagDeal from "./FlagDeal";
import "@testing-library/jest-dom";

// Mock fetch
global.fetch = jest.fn();

describe("FlagDeal", () => {
  const defaultProps = {
    uuid: "user123",
    dealID: 1,
    totalFlags: 2,
    userFlag: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders flag count", () => {
    render(<FlagDeal {...defaultProps} />);
    expect(screen.getByText(/Flags: 2/i)).toBeInTheDocument();
  });

  test("shows 'Flag Deal' button when not flagged", () => {
    render(<FlagDeal {...defaultProps} />);
    expect(screen.getByText(/Flag Deal/i)).toBeInTheDocument();
  });

  test("disables button if user not logged in", () => {
    render(<FlagDeal {...defaultProps} uuid={null} />);
    expect(screen.getByText(/Flag Deal/i)).toBeDisabled();
  });

  test("opens menu when clicking Flag Deal", () => {
    render(<FlagDeal {...defaultProps} />);
    
    fireEvent.click(screen.getByText(/Flag Deal/i));

    expect(screen.getByText(/Inaccurate Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Inaccurate Description/i)).toBeInTheDocument();
  });

  test("increments flag count after flagging", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<FlagDeal {...defaultProps} />);

    fireEvent.click(screen.getByText(/Flag Deal/i));
    fireEvent.click(screen.getByText(/Inaccurate Price/i));

    await waitFor(() => {
      expect(screen.getByText(/Flags: 3/i)).toBeInTheDocument();
    });
  });

  
  test("decrements flag count after undo", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <FlagDeal
        {...defaultProps}
        userFlag={true}
        totalFlags={3}
      />
    );

    fireEvent.click(screen.getByText(/Remove Flag/i));

    await waitFor(() => {
      expect(screen.getByText(/Flags: 2/i)).toBeInTheDocument();
    });
  });
});