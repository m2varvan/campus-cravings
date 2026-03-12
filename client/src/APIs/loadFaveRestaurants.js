const loadFaveRestaurants = async (uuid) => {
  const response = await fetch("/api/load/fave/restaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid }),
  });

  if (!response.ok) {
    throw new Error("Failed to load favourite restaurants");
  }

  return await response.json();

}

export default loadFaveRestaurants;