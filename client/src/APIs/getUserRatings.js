export const getUserRatings = async (userID) => {
  try {
    const res = await fetch('/api/user/rated/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch rated deals');
    }

    return await res.json();
  } catch (error) {
    console.log('Failed to load rated deals.', error);
  }
};