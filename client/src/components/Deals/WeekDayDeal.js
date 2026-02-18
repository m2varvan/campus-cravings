import Deal from './Deal';
import React, {useState} from 'react';
import { Typography, Box, Button } from '@mui/material';

const WeekDayDeal = ({uuid, day, dealList}) => {

    // Variables and functions to show only 6 by default
    const defaultVisible = 6
    const [visibleCount, setVisibleCount] = useState(defaultVisible);
    const handleShowMore = () => {
        setVisibleCount(dealList.length);
    };
    const handleShowLess = () => {
        setVisibleCount(defaultVisible)
    };

    return (
        <>
            
            <Box
                sx={{
                border: '3px solid',
                borderColor: 'secondary.dark',
                borderRadius: 2,
                p: 2,
                m: 1,
                maxHeight: 880,    // scrollable height
                overflowY: 'auto',
                }}
            >
                {/* Day Title */}
                <Typography variant="h5">{day}</Typography>

                {/* No promotions */}
                {dealList.length === 0 ? (
                <Typography>No promotions available on {day}.</Typography>
                ) : (
                <>
                    {/* Visible deals */}
                    {dealList.slice(0, visibleCount).map((deal) => (
                    <Deal key={deal.dealID} uuid={uuid} deal={deal} />
                    ))}

                    {/* Show More button */}
                    {visibleCount < dealList.length && (
                    <Box textAlign="center" mt={2}>
                        <Button
                        variant="contained"
                        onClick={handleShowMore}
                        color="secondary"
                        >
                        Show More
                        </Button>
                    </Box>
                    )}

                    {/* Show Less button */}
                    {visibleCount > defaultVisible && (
                    <Box textAlign="center" mt={2}>
                        <Button
                        variant="contained"
                        onClick={handleShowLess}
                        color="secondary"
                        >
                        Show Less
                        </Button>
                    </Box>
                    )}
                </>
                )}
            </Box>
        </>
    );

};

export default WeekDayDeal;