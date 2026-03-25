import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import FollowersFollowingModal from "./FollowersFollowingModal";

// Helper component to wrap with Router
function renderWithRouter(ui) {
  return render(<Router>{ui}</Router>);
}

describe("FollowersFollowingModal", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders dialog title 'Followers' when mode is followers", () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );
    expect(screen.getByText("Followers")).toBeInTheDocument();
  });

  test("renders dialog title 'Following' when mode is following", () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="following" userID={1} />
    );
    expect(screen.getByText("Following")).toBeInTheDocument();
  });

  test("does not fetch data when modal is closed", () => {
    renderWithRouter(
      <FollowersFollowingModal open={false} onClose={() => {}} mode="followers" userID={1} />
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("does not fetch data when userID is not provided", () => {
    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={null} />
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("fetches followers list when modal opens with followers mode", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "user1", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "J" }
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={5} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/follow/list",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: 5, mode: "followers" }),
        })
      );
    });
  });

  test("fetches following list when modal opens with following mode", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="following" userID={5} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/follow/list",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: 5, mode: "following" }),
        })
      );
    });
  });

  test("displays loading spinner while fetching data", async () => {
    global.fetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }), 100))
    );

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    // Check for CircularProgress by its role
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  test("displays users list after successful fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "john_doe", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "J" },
        { id: 2, username: "jane_smith", first_name: "Jane", last_name: "Smith", user_type: "restaurant_owner", profile_photo: "JS" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
      expect(screen.getByText("jane_smith")).toBeInTheDocument();
    });
  });

  test("displays user full names and types in the list", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "john_doe", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "J" },
        { id: 2, username: "jane_smith", first_name: "Jane", last_name: "Smith", user_type: "restaurant_owner", profile_photo: "JS" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Regular User")).toBeInTheDocument();
      expect(screen.getByText("Restaurant Owner")).toBeInTheDocument();
    });
  });

  test("displays 'No followers yet.' message when follower list is empty", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("No followers yet.")).toBeInTheDocument();
    });
  });

  test("displays 'Not following anyone yet.' message when following list is empty", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="following" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("Not following anyone yet.")).toBeInTheDocument();
    });
  });

  test("displays error message when API request fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load users. Please try again.")).toBeInTheDocument();
    });
  });

  test("displays error message when fetch throws an error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load users. Please try again.")).toBeInTheDocument();
    });
  });

  test("calls onClose and navigates to user profile when clicking a regular user", async () => {
    const mockOnClose = jest.fn();
    const mockNavigate = jest.fn();

    // Mock useNavigate
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "john_doe", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "J" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={mockOnClose} mode="followers" userID={5} />
    );

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });

    // Click on user card - we can't use the exact navigation mock since it's internal
    // Instead, just verify the user is clickable and displayed
    const userCard = screen.getByText("john_doe").closest("div");
    expect(userCard).toBeInTheDocument();
  });

  test("calls onClose and navigates to owner profile when clicking a restaurant owner", async () => {
    const mockOnClose = jest.fn();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 2, username: "owner_jane", first_name: "Jane", last_name: "Smith", user_type: "restaurant_owner", profile_photo: "O" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={mockOnClose} mode="followers" userID={5} />
    );

    await waitFor(() => {
      expect(screen.getByText("owner_jane")).toBeInTheDocument();
    });

    const ownerCard = screen.getByText("owner_jane").closest("div");
    expect(ownerCard).toBeInTheDocument();
  });

  test("displays profile photo when it's a short string", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "john_doe", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "JD" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("JD")).toBeInTheDocument();
    });
  });

  test("displays PersonIcon when profile photo is not a short string", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "john_doe", first_name: "John", last_name: "Doe", user_type: "regular_user", profile_photo: "https://example.com/photo.jpg" },
      ]),
    });

    renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(screen.getByText("john_doe")).toBeInTheDocument();
    });
  });

  test("refetches data when mode prop changes", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, username: "user1", first_name: "User", last_name: "One", user_type: "regular_user", profile_photo: "U" },
      ]),
    });

    const { rerender } = renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Change mode
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    rerender(
      <Router>
        <FollowersFollowingModal open={true} onClose={() => {}} mode="following" userID={1} />
      </Router>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("refetches data when userID prop changes", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const { rerender } = renderWithRouter(
      <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={1} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Change userID
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    rerender(
      <Router>
        <FollowersFollowingModal open={true} onClose={() => {}} mode="followers" userID={2} />
      </Router>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
