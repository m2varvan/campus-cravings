import React, { useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";

const FlagDeal = ({ uuid, dealID, totalFlags, userFlag }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [flagged, setFlagged] = useState(userFlag);
  const [flagCount, setFlagCount] = useState(totalFlags ?? 0);

  // Update local flagged and flagCount when props update. 
  React.useEffect(() => {
    setFlagCount(userFlag)
    setFlagCount(totalFlags ?? 0)
  },[totalFlags, userFlag])

  const open = Boolean(anchorEl);

  // Options to select when flagging a deal
  const flagReasons = [
    "Inaccurate Price",
    "Inaccurate Description",
    "Deal does not exist",
  ];

  // Open dropdown
  const handleClick = (event) => {
    if (!uuid) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Flag deal
  const handleFlag = async (reason) => {
    try {
      await fetch("/api/flag/deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: uuid,
          dealID,
          reason,
        }),
      });

      setFlagged(true);
      setFlagCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error flagging deal:", err);
    }

    handleClose();
  };

  // Undo flag
  const handleUndo = async () => {
    try {
      await fetch("/api/unflag/deal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: uuid,
          dealID,
        }),
      });

      setFlagged(false);
      setFlagCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error removing flag:", err);
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography>
        Flags: {flagCount ? flagCount : 0}
      </Typography>
    
      {/* If the deal has not been flagged by the user, 
      show flagging button */}
      {!flagged ? (
        <>
          <Button
            variant="outlined"
            size='small'
            color="error"
            onClick={handleClick}
            disabled={!uuid}
          >
            Flag Deal
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {flagReasons.map((reason, index) => (
              <MenuItem key={index} onClick={() => handleFlag(reason)}>
                {reason}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (

        // If the deal has been flagged by the user, 
        // show the remove flag button
        <Button 
            variant="contained"
            size='small'
            color="error" 
            onClick={handleUndo}>
          Remove Flag
        </Button>
      )}

      {flagged && (
        <Typography>
          You flagged this deal.
        </Typography>
      )}
    </Stack>
  );
};

export default FlagDeal;