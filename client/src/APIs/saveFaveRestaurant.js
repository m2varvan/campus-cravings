const saveFaveRestaurant= async (uuid, restaurantID) => {
  const response = await fetch("/api/save/fave/restaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid, restaurantID }),
  });

  if (!response.ok) {
    throw new Error("Failed to save favourite restaurant");
  }

  return await response.json();
}

export default saveFaveRestaurant