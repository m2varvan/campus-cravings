const loadFaveRestaurants = async (profileUserID, viewerID) => {
  const response = await fetch("/api/load/fave/restaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileUserID, viewerID }),
  });

  if (!response.ok) {
    throw new Error("Failed to load favourite restaurants");
  }

  return await response.json();

}

export default loadFaveRestaurants;