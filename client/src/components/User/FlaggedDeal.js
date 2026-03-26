import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

const FlaggedDeal = ({ deal, setFlaggedDeals, setErrorMSG, setSuccessMSG }) => {

  // States to open and close the confirmation dialogs
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openClear, setOpenClear] = React.useState(false);

  // Function to delete a deal
  const handleDeleteDeal = async () => {
    try {
      const response = await fetch("/api/delete/deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealID: deal.dealID }),
      });

      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      // Set success message and then remove deal from list
      setSuccessMSG(`${deal.dealName} was successfully deleted.`);
      setFlaggedDeals(prev => prev.filter(d => d.dealID !== deal.dealID));

    } catch (err) {
      console.error("Failed to delete deal:", err.message);
      setErrorMSG(`An error occurred deleting ${deal.dealName}.`);
    } finally {
      setOpenDelete(false);
    }
  };

  // Function to clear flags for a deal
  const handleClearFlags = async () => {
    try {
      const response = await fetch("/api/clear/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealID: deal.dealID }),
      });

      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      // Set success message and then remove deal from list
      setSuccessMSG(`Flags successfully cleared for ${deal.dealName}.`);
      setFlaggedDeals(prev => prev.filter(d => d.dealID !== deal.dealID));

    } catch (err) {
      console.error("Failed to clear flags:", err.message);
      setErrorMSG(`An error occurred clearing the flags for ${deal.dealName}.`);
    } finally {
      setOpenClear(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        height: '100%',
        bgcolor: "primary.light",
        p: 2,
        m: 1,
        borderRadius: 2,
        boxShadow: 1,
        "&:hover": { filter: "brightness(0.97)" },
      }}
    >
      {/* Deal Name and Price */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {deal.dealName}
        </Typography>
        <Typography variant="subtitle1">${deal.dealPrice}</Typography>
      </Box>

      {/* Restaurant and Description */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {deal.restaurantName}
        </Typography>
        <Typography variant="body2">
          Description: {deal.dealDescription}
        </Typography>
      </Box>

      {/* Flag Counts */}
      <Box sx={{ mb: 1, mt: 'auto' }}>
        <Typography variant="body2">
          Flags: Deal Does not Exist ({deal.dneCount}) | Inaccurate Price ({deal.inaccuratePriceCount}) | Inaccurate Description ({deal.inaccurateDescriptionCount})
        </Typography>
      </Box>

      {/* Buttons */}
      <Stack direction="row" spacing={1} sx={{mt:'auto'}}>
        <Button
          variant="contained"
          size="small"
          color="error"
          data-cy="delete-deal-btn"
          onClick={() => setOpenDelete(true)}
        >
          Delete Deal
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          data-cy="clear-flags-btn"
          onClick={() => setOpenClear(true)}
        >
          Clear Flags
        </Button>
      </Stack>

      {/* Confirmation to delete deal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Deal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deal.dealName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDelete(false)}
            sx={{
              borderColor: 'primary.dark',      
              color: 'primary.dark', 
              '&:hover': {
                borderColor: 'primary.dark',  
                backgroundColor: 'transparent',
              },
            }}
          >
            Cancel
          </Button>
          <Button variant="outlined" color='error' data-cy="confirm-delete-btn" onClick={handleDeleteDeal}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation to clear flags */}
      <Dialog open={openClear} onClose={() => setOpenClear(false)}>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all flags for <strong>{deal.dealName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color='primary' onClick={() => setOpenClear(false)}>Cancel</Button>
          <Button variant="outlined" color='error' data-cy="confirm-remove-btn" onClick={handleClearFlags}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlaggedDeal;