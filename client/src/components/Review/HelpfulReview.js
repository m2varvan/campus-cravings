import React, { useState } from "react";

function HelpfulReview({ reviewID, helpfulVotes, user }) {

  const [votes, setVotes] = useState(helpfulVotes);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");

  const markHelpful = async () => {

    if (!user) {
      setError("Login required to vote helpful.");
      return;
    }

    if (voted) return;

    try {

      const res = await fetch("/api/review/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewID })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setVotes(votes + 1);
      setVoted(true);

    } catch (err) {
      setError("Failed to mark helpful");
    }
  };

  return (
    <div>

      <button onClick={markHelpful} disabled={voted}>
        👍 Helpful ({votes})
      </button>

      {error && <p style={{color:"red"}}>{error}</p>}

    </div>
  );
}

export default HelpfulReview;