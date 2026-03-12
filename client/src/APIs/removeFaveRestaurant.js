const removeFaveRestaurant= async (uuid, restaurantID) => {
  const response = await fetch("/api/remove/fave/restaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid, restaurantID }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove favourite restaurant");
  }

  return await response.json();
}

export default removeFaveRestaurant