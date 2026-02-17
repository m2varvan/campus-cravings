import { Typography, Box, Grid } from "@mui/material";
import React from 'react';
import ExpandedDeal from "./ExpandedDeal";

const Deal = ({uuid, deal}) => {

    const [openDetails, setOpenDetails] = React.useState(false)

    return(
        <>
        <Grid item xs={12} sm={6} lg={4}>
            <Box
                onClick={() => setOpenDetails(true)}
                sx={{
                bgcolor: 'secondary.light',
                p: 2,
                m: 1,
                borderRadius: 1,
                }}
            >
                {/* Deal name and price on opposite ends */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h6">{deal.dealName}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {deal.restaurantName}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">${deal.dealPrice}</Typography>
                    <Typography variant="body2">
                        ⭐{(deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3} ({deal.numRatings && 0})
                    </Typography>
                </Box>
                
                </Box>
            </Box>
        </Grid>

        <ExpandedDeal uuid={uuid} deal={deal} handleClose={() => setOpenDetails(false)} open={openDetails} />
        </>

    )
};

export default Deal