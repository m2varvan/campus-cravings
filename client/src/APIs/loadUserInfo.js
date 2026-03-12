const loadUserInfo = async (uuid) => {
  const response = await fetch("/api/load/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uuid }),
  });

  if (!response.ok) {
    throw new Error("Failed to load user info");
  }

  return await response.json();
}

export default loadUserInfo