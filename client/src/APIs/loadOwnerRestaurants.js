const loadOwnerRestaurants = async (uuid) => {
    const response = await fetch(`/api/owner/restaurants/${uuid}`);
    if (!response.ok) throw new Error("Failed to fetch owner restaurants");
    return response.json();
};

export default loadOwnerRestaurants;