import React from "react";
import { Typography, Box } from "@mui/material";

const RateDeal = ({uuid, deal}) => {

    return(
         <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            My Ratings
            </Typography>

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
        </Box>

    );

};

export default RateDeal;
