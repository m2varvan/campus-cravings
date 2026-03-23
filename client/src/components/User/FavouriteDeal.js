import { Typography, Box, } from "@mui/material";
import React from 'react';
import ExpandedDeal from "../Deals/ExpandedDeal";
import Favourite from "../Deals/Favourite";
import saveFaveDeal from "../../APIs/saveFaveDeal";
import removeFaveDeal from "../../APIs/removeFaveDeal";

const FavouriteDeal = ({uuid, deal, reloadDeals, handleRemoveDeal}) => {

    // State to open dialog box with deal details
    const [openDetails, setOpenDetails] = React.useState(false);

    // Calculate average rating
    const avgRating = ((deal.dealValueRating + deal.dealPortionRating + deal.dealTasteRating) / 3).toFixed(1);

    const removeDeal = () => {
        handleRemoveDeal(deal.dealID);
        removeFaveDeal(uuid, deal.dealID);
    }

    return(
        <>
            <Box
                sx={{
                    bgcolor: 'primary.light',
                    p:  1, 
                    pb: 0.5, 
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
                            variant= {'subtitle1'}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {deal.dealName}
                        </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant={'subtitle1'}>
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

                {/* Favourite Deal */}
                <Box sx={{ display: 'flex', justifyContent: 'space-betwen', alignItems: 'flex-start', }}>
                    <Box onClick={() => setOpenDetails(true)} sx={{width: '90%'}} />
                        
                    <Favourite 
                        uuid={uuid} 
                        itemID={deal.dealID} 
                        fave={deal.fave} 
                        saveFave={saveFaveDeal} 
                        removeFave={removeDeal} />
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

export default FavouriteDeal