const loadFaveDeals = async (uuid) => {
  const response = await fetch("/api/load/fave/deal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid }),
  });

  if (!response.ok) {
    throw new Error("Failed to load favourite deals");
  }

  return await response.json();
}

export default loadFaveDeals