import { Typography, Box, Grid } from "@mui/material";

const Deal = ({uuid, deal}) => {
    return(
        <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{bgcolor: 'primary.light', p: 1, m: 1}}>
                <Typography>
                    {deal.dealName}, ${deal.dealPrice}, {deal.restaurantName}
                </Typography>
            </Box>
        </Grid>
    )
};

export default Deal