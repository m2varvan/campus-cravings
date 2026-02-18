import { Typography, Box, Grid } from "@mui/material";
import React from 'react';
import ExpandedDeal from "./ExpandedDeal";

const Deal = ({uuid, deal}) => {

    // State to open dialog box with deal details
    const [openDetails, setOpenDetails] = React.useState(false);

    // Calculate average rating
    const avgRating = ((deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3).toFixed(1);

    return(
        <>
        <Grid item xs={12} sm={6} lg={4}>
            <Box
                onClick={() => setOpenDetails(true)} // Open dialog with details on click of box
                data-testid={`expand-dealID-${deal.dealID}`}
                sx={{
                    bgcolor: 'secondary.light',
                    p: 2,
                    m: 1,
                    borderRadius: 1,
                }}
            >
                {/* Deal name and price on opposite ends */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>

                {/* Name and Restaurant Name */}
                <Box sx={{width: '75%'}}>
                   <Typography
                        variant="h6"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {deal.dealName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {deal.restaurantName}
                    </Typography>
                </Box>
                
                {/* Price and Average Rating */}
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6">
                        ${deal.dealPrice}
                    </Typography>
                    <Typography variant="body2">
                        {deal.numRatings ?
                        '⭐ ' + avgRating + '/5 ' + (deal.numRatings)
                        :
                        'No ratings yet' // In italics
                        }
                    </Typography>
                </Box>
                
                </Box>
            </Box>
        </Grid>
        
        {/* Dialog with expanded deal information */}
        <ExpandedDeal uuid={uuid} deal={deal} handleClose={() => setOpenDetails(false)} open={openDetails} />
        </>

    )
};

export default Deal