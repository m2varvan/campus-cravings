import React from "react";
import { Typography, Box, Button, Alert } from "@mui/material";
import RateDealButtons from "./RateDealButtons";

const RateDeal = ({uuid, deal}) => {


    // States to load the user's ratings
    const [loadingRatings, setLoadingRatings] = React.useState(false)
    const [loadRatingsError, setLoadRatingsError] = React.useState(false)
    const [userRating, setUserRating] = React.useState(null)
    const [initialLoad, setInitialLoad] = React.useState(true);

    // State to show/hide rating star buttons
    const [showButtons, setShowButtons] = React.useState(false)

    // State with success are error messages
    const [successMsg, setSuccessMsg] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

    const deleteRating = async (ratingID) => {
        try {
            const res = await fetch('/api/deleterating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealID: deal.dealID,
                    userID: uuid,
                    ratingID: ratingID
                })
            });

            if (!res.ok) throw new Error('Failed to delete');

            setUserRating(null);
            setErrorMsg('')
            setSuccessMsg('Rating deleted successfully!')
            loadUserRating();

        } catch (err) {
            console.error(err);
            setErrorMsg('Failed to delete rating')
            setSuccessMsg('')
        }
    };
    
    const loadUserRating = async () => {
        try{
            if (initialLoad) setLoadingRatings(true);
            setLoadRatingsError(false)

            console.log('DealID', deal.dealID)

            const res = await fetch('/api/userrating', {
                method: 'POST',
                headers : {'Content-Type': 'application/json'},
                body: JSON.stringify({ dealID: deal.dealID, userID: uuid})
                });
            
            if (!res.ok) throw new Error(res.statusText);
            
            let data = await res.json();
            console.log('User rating:', data)
            
            if (data.length > 1) {
                // If the db response is longer than 1, throw an error
                throw new Error('More than one rating returned from DB');
            } else if (data.length === 1) {
                // If data is length 1, set user rating
                setUserRating(data[0]);
            }


        } catch (error) {
            console.error('Failed to get user ratings:', error);
            setLoadRatingsError(true)
        } finally {
            setLoadingRatings(false)
            setInitialLoad(false);
        }
    }

    // If uuid is not null, load user ratings on render
    React.useEffect(() => {
        if (uuid) {
            loadUserRating();
        }
    }, [uuid, deal.dealID]);

    React.useEffect(() => {
        
    })


    return(
         <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                My Ratings
            </Typography>

            {/* Login message is user in not logged in  */}
            { !uuid &&
                <Typography>Log in to rate this deal.</Typography>
            }

            {/* Loading ratings message */}
            {loadingRatings &&
                <Typography>Loading your rating...</Typography>}

            {/* Error loading ratings message */}
            {!loadingRatings && uuid && loadRatingsError &&
                <Typography> An error occured loading your ratings. Please try again. </Typography> }

            {/* If user has not submitted rating before*/}
            {uuid && !loadingRatings && !loadRatingsError && !userRating && (
                <>
                    {showButtons ?
                    <RateDealButtons 
                        uuid={uuid}
                        dealID={deal.dealID}
                        prevRating={userRating}
                        setShowButtons={setShowButtons}
                        setErrorMsg={setErrorMsg}
                        setSuccessMsg={setSuccessMsg}
                        refreshRatings={loadUserRating}
                        />
                    :
                    <>
                    <Typography>You have not submitted a rating for this deal.</Typography>
                    <Button
                        onClick={()=>setShowButtons(true)}
                        sx={{
                            my: 1,
                            backgroundColor: 'primary.light',
                            color: 'secondary.dark',
                            '&:hover': {
                            backgroundColor: 'primary.main',
                            },
                        }}
                        >
                        Submit a Rating
                    </Button>
                    </>
                    }
                    
                </>
            )}

            {/* Show user's previous rating and option to update rating */}
            {uuid && !loadingRatings && !loadRatingsError && userRating && (
            <>
                {showButtons ?
                <RateDealButtons 
                    uuid={uuid}
                    dealID={deal.dealID}
                    prevRating={userRating}
                    setShowButtons={setShowButtons}
                    setErrorMsg={setErrorMsg}
                    setSuccessMsg={setSuccessMsg}
                    refreshRatings={loadUserRating}
                    />
                :
                <>
                {/* Value Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">My Value Rating</Typography>
                    <Typography variant="body2">⭐ {userRating.valueRating.toFixed(1)}/5</Typography>
                </Box>

                {/* Taste Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">My Taste Rating</Typography>
                    <Typography variant="body2">⭐ {userRating.tasteRating.toFixed(1)}/5</Typography>
                </Box>

                {/* Portion Size Ratings */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">My Portion Size Rating </Typography>
                    <Typography variant="body2">⭐ {userRating.portionRating.toFixed(1)}/5</Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Rated on: {userRating.ratingDate}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1}}>
                    <Button
                        onClick={()=>setShowButtons(true)}
                        sx={{
                            backgroundColor: 'primary.light',
                            color: 'secondary.dark',
                            '&:hover': {
                            backgroundColor: 'primary.main',
                            },
                        }}
                        >
                        Edit your Rating
                    </Button>
                    <Button
                        onClick={() => deleteRating(userRating.ratingID)}
                        sx={{
                            backgroundColor: 'primary.light',
                            color: 'secondary.dark',
                            '&:hover': {
                            backgroundColor: 'primary.main',
                            },
                        }}
                        >
                        Delete your Rating
                    </Button>
                </Box>
                </>
                }
                
            </>
            )}

        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        </Box>


    );

};

export default RateDeal;
