import React, { useState } from "react";
import { Box, Typography, Button, Rating, Alert } from "@mui/material";

const UserRating = ({ rating, uuid, onUpdate, onDelete, readOnly = false }) => {
  const [taste, setTaste] = useState(Number(rating.userTasteRating));
  const [value, setValue] = useState(Number(rating.userValueRating));
  const [portion, setPortion] = useState(Number(rating.userPortionRating));

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editing, setEditing] = useState(false);

  const handleUpdateRating = async () => {
    try {
      if (taste < 0 || taste > 5 || value < 0 || value > 5 || portion < 0 || portion > 5) {
        setErrorMsg("Ratings must be between 0 and 5");
        return;
      }

      const res = await fetch("/api/edit/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealID: rating.dealID,
          userID: uuid,
          tasteRating: taste,
          valueRating: value,
          portionRating: portion,
          ratingID: rating.ratingID || null,
        }),
      });

      if (!res.ok) {
        setSuccessMsg("");
        setErrorMsg("Failed to update rating.");
        return;
      }

      setSuccessMsg("Rating updated successfully!");
      setErrorMsg("");
      setEditing(false);
      onUpdate(rating.ratingID, taste, value, portion);
    } catch (err) {
      setErrorMsg("Failed to Update Rating");
      setSuccessMsg("");
    }
  };

  const handleDeleteRating = async () => {
    try {
      const res = await fetch("/api/delete/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealID: rating.dealID,
          userID: uuid,
          ratingID: rating.ratingID,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      setErrorMsg("");
      setSuccessMsg("Rating deleted successfully!");
      onDelete(rating.ratingID);
    } catch (err) {
      setErrorMsg("Failed to delete rating");
      setSuccessMsg("");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setTaste(Number(rating.userTasteRating));
    setValue(Number(rating.userValueRating));
    setPortion(Number(rating.userPortionRating));
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <Box sx={{ border: "3px solid", borderColor: "divider", borderRadius: 2, p: 2, mb: 2 }}>

      {/* Deal and Restaurant Info */}
      <Typography variant="h6" color="text.secondary">
        {rating.dealName} •{" "}
        <Box component="span" sx={{ fontStyle: "italic" }}>
          {rating.restaurantName}
        </Box>
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 1 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 1 }}>{errorMsg}</Alert>}

      {/* Value Rating */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2">Value Rating</Typography>
        <Rating
          name="value"
          value={value}
          precision={0.1}
          readOnly={!editing || readOnly}
          onChange={(e, newValue) => setValue(newValue)}
        />
      </Box>

      {/* Taste Rating */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2">Taste Rating</Typography>
        <Rating
          name="taste"
          value={taste}
          precision={0.1}
          readOnly={!editing || readOnly}
          onChange={(e, newValue) => setTaste(newValue)}
        />
      </Box>

      {/* Portion Size Rating */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2">Portion Size Rating</Typography>
        <Rating
          name="portion"
          value={portion}
          precision={0.1}
          readOnly={!editing || readOnly}
          onChange={(e, newValue) => setPortion(newValue)}
        />
      </Box>

      {/* Action Buttons — hidden when readOnly */}
      {!readOnly && (
        <Box sx={{ display: "flex", mt: 1 }}>
          {editing ? (
            <>
              <Button variant="contained" size="small" onClick={handleUpdateRating} sx={{ mr: 1 }}>
                Update
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={() => setEditing(true)} sx={{ mr: 1 }}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={handleDeleteRating}>
                Delete
              </Button>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UserRating;