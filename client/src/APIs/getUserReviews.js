export const getUserReviews = async (userID) => {
  try {
    const res = await fetch('/api/user/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch reviewed deals');
    }

    return await res.json();
  } catch (error) {
    console.log('Failed to load reviewed deals.', error);
  }
};