import React from "react";
import { Typography, Box } from "@mui/material";

const RateDeal = ({uuid, deal}) => {

    const [loadingRatings, setLoadingRatings] = React.useState(false)
    const [loadLoadRatingsError, setLoadRatingsError] = React.useState(false)
    const [userRatings, setUserRatings] = React.useState({})
    
    const loadUserRating = async () => {
        try{
            setLoadingRatings(true)
            setLoadRatingsError(false)

            const res = await fetch('/api/userrating', {
                method: 'POST',
                headers : {'Content-Type': 'application/json'},
                body: JSON.stringify({ dealID: deal.dealID, userID: uuid})
                });
            
            if (!res.ok) throw new Error(res.statusText);
            
            const data = await res.json();
            console.log(data);
            setUserRatings(data);
        } catch (error) {
            console.error('Failed to get user ratings:', error);
            setLoadRatingsError(true)
        } finally {
            setLoadingRatings(false)
        }
    }


    // If uuid is not null, load user ratings on render
    React.useEffect(() => {
        uuid && loadUserRating();

    }, [])

    return(
         <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                My Ratings
            </Typography>

            { !uuid ?
                <Typography>Log in to rate this deal.</Typography>
            :
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Value</Typography>
                    <Typography variant="body2">My Value Rating Here</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Taste</Typography>
                    <Typography variant="body2">My Taste Rating Here</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Portion</Typography>
                    <Typography variant="body2">My Portion Rating Here</Typography>
                </Box>
            </>
            }
        </Box>


    );

};

export default RateDeal;
