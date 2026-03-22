export const fetchDealReviews = async (dealID, uuid) => {
  try {
    const res = await fetch(`/api/deal/${dealID}/reviews?userID=${uuid}`);

    if (!res.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await res.json();
  } catch (error) {
    throw new Error('Failed to load reviews.');
  }
};