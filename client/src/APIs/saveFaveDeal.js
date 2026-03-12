const saveFaveDeal = async (uuid, dealID) => {
  const response = await fetch("/api/save/fave/deal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid, dealID }),
  });

  if (!response.ok) {
    throw new Error("Failed to save favourite deal");
  }

  return await response.json();
}

export default saveFaveDeal