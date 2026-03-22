import { Typography, Box, } from "@mui/material";
import React from 'react';
import ExpandedDeal from "./ExpandedDeal";
import DealVote from "./DealVote";
import Favourite from "./Favourite";
import saveFaveDeal from "../../APIs/saveFaveDeal";
import removeFaveDeal from "../../APIs/removeFaveDeal";

const Deal = ({uuid, deal, size='lg', reloadDeals}) => {

    // State to open dialog box with deal details
    const [openDetails, setOpenDetails] = React.useState(false);

    // Calculate average rating
    const avgRating = ((deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3).toFixed(1);

    return(
        <>
            <Box
                data-cy="deal-card"
                data-testid={`expand-dealID-${deal.dealID}`}
                sx={{
                    bgcolor: 'secondary.light',
                    p: size==='lg' ? 2 : 1, // If large size, more padding
                    pb: size==='lg' ? 1 : 0.5, // If large size, more padding
                    m: 1,
                    borderRadius: 1,
                    "&:hover": {
                        filter: "brightness(0.95)",
                        boxShadow: 1,
                    },
                }}
            >

            {/* Box for clickable area */}
            <Box onClick={() => setOpenDetails(true)} >
                {/* Deal name and price on opposite ends */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                    {/* Name and Restaurant Name */}
                    <Box sx={{width: '70%'}}>
                    <Typography
                            data-testid="deal-name"
                            variant= {size === 'lg' ? "h6": 'subtitle1'}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {deal.dealName}
                        </Typography>
                    </Box>
                    
                    {/* Price and Average Rating */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant={size === 'lg' ? "h6": 'subtitle1'}>
                            ${deal.dealPrice}
                        </Typography>
                    </Box>
                </Box>

                {/* Restaurant name and ratings on opposite ends */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                    {/* Restaurant Name */}
                    <Box sx={{width: '60%'}}>
                        <Typography 
                            variant="body2" 
                            sx={{
                                fontStyle: 'italic',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                        }}>
                            {deal.restaurantName}
                        </Typography>
                    </Box>
                    
                    {/*Average Rating */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                            {deal.numRatings ?
                            '⭐ ' + avgRating + '/5  (' + deal.numRatings + ')'
                            :
                            'No ratings yet'
                            }
                        </Typography>
                    </Box>
                </Box>
                </Box>

                {/* Deal Votes */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', }}>
                    <DealVote 
                        uuid={uuid} 
                        totalVote={deal.totalVote} 
                        userVote={deal.userVote} 
                        dealID={deal.dealID} />
                        
                    <Favourite 
                        uuid={uuid} 
                        itemID={deal.dealID} 
                        fave={deal.fave} 
                        saveFave={saveFaveDeal} 
                        removeFave={removeFaveDeal} />
                </Box>


            </Box>
        
        {/* Dialog with expanded deal information */}
        <ExpandedDeal uuid={uuid} 
                    dealID={deal.dealID} 
                    handleClose={() => setOpenDetails(false)} 
                    open={openDetails} 
                    reloadDeals={reloadDeals} />
        </>

    )
};

export default Deal