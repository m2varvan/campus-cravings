import { Typography, Box, Button } from "@mui/material";
import React from 'react';
import ExpandedDeal from "../Deals/ExpandedDeal";
import EditDealDialog from "./EditDealDialog";

const OwnerDeal = ({ uuid, deal, reloadDeals }) => {
    const [openDetails, setOpenDetails] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const avgRating = ((deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3).toFixed(1);

    return (
        <>
            <Box sx={{
                bgcolor: 'primary.light', p: 1, pb: 0.5, m: 1, borderRadius: 1,
                "&:hover": { filter: "brightness(0.95)", boxShadow: 1 },
            }}>
                <Box onClick={() => setOpenDetails(true)} sx={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ width: '70%' }}>
                            <Typography variant="subtitle1"
                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {deal.dealName}
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1">${deal.dealPrice}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{deal.restaurantName}</Typography>
                        <Typography variant="body2">
                            {deal.numRatings ? '⭐ ' + avgRating + '/5 (' + deal.numRatings + ')' : 'No ratings yet'}
                        </Typography>
                    </Box>
                </Box>

                {/* Edit button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                    <Button size="small" variant="contained" onClick={() => setOpenEdit(true)}>
                        Edit
                    </Button>
                </Box>
            </Box>

            <ExpandedDeal 
                uuid={uuid} 
                dealID={deal.dealID}
                handleClose={() => setOpenDetails(false)} 
                open={openDetails} 
                reloadDeals={reloadDeals} 
            />

            <EditDealDialog
                open={openEdit}
                handleClose={() => setOpenEdit(false)}
                deal={deal}
                onDealUpdated={reloadDeals}
                onDealDeleted={(dealID) => {
                    reloadDeals();
                    setOpenEdit(false);
                }}
            />
        </>
    );
};

export default OwnerDeal;