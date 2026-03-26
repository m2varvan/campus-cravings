import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FollowButton from "./FollowButton";

describe("FollowButton", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders nothing when uuid and targetUserID are the same (user's own profile)", () => {
    const { container } = render(
      <FollowButton uuid={1} targetUserID={1} initialFollow={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing when uuid is not provided", () => {
    const { container } = render(
      <FollowButton uuid={undefined} targetUserID={2} initialFollow={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders Follow button when not following", () => {
    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );
    expect(screen.getByRole("button", { name: /Follow/i })).toBeInTheDocument();
  });

  test("renders Unfollow button when already following", () => {
    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={true} />
    );
    expect(screen.getByRole("button", { name: /Unfollow/i })).toBeInTheDocument();
  });

  test("calls follow API when not following and button is clicked", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button", { name: /Follow/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/follow",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerID: 1, followingID: 2 }),
        })
      );
    });
  });

  test("calls unfollow API when already following and button is clicked", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={true} />
    );

    const button = screen.getByRole("button", { name: /Unfollow/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/unfollow",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerID: 1, followingID: 2 }),
        })
      );
    });
  });

  test("toggles button text from Follow to Unfollow after successful follow", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button", { name: /Follow/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Unfollow/i })).toBeInTheDocument();
    });
  });

  test("toggles button text from Unfollow to Follow after successful unfollow", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={true} />
    );

    const button = screen.getByRole("button", { name: /Unfollow/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Follow/i })).toBeInTheDocument();
    });
  });

  test("displays loading state (... text) while request is in progress", async () => {
    global.fetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }), 100))
    );

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByRole("button", { name: /\.\.\./ })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /\.\.\./ })).not.toBeInTheDocument();
    });
  });

  test("disables button while request is in progress", async () => {
    global.fetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }), 100))
    );

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  test("displays error alert when API returns error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Permission denied" }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Permission denied")).toBeInTheDocument();
    });
  });

  test("displays generic error alert when fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
    });
  });

  test("updates button state based on initialFollow prop changes", async () => {
    const { rerender } = render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    expect(screen.getByRole("button", { name: /Follow/i })).toBeInTheDocument();

    rerender(
      <FollowButton uuid={1} targetUserID={2} initialFollow={true} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Unfollow/i })).toBeInTheDocument();
    });
  });

  test("does not toggle state if API returns not ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Server error" }),
    });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button", { name: /Follow/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });

    // Button should still say "Follow" since the state change didn't happen
    expect(screen.getByRole("button", { name: /Follow/i })).toBeInTheDocument();
  });

  test("clears previous error when making a new request", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "First error" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

    render(
      <FollowButton uuid={1} targetUserID={2} initialFollow={false} />
    );

    const button = screen.getByRole("button");

    // First click - expect error
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("First error")).toBeInTheDocument();
    });

    // Second click - error should be cleared
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByText("First error")).not.toBeInTheDocument();
    });
  });
});
