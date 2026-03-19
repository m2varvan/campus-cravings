const loadOwnerDeals = async (uuid) => {
    const response = await fetch(`/api/owner/deals/${uuid}`);
    if (!response.ok) throw new Error("Failed to fetch owner deals");
    return response.json();
};

export default loadOwnerDeals;