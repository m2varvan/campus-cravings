import { Typography, Grid } from "@mui/material";

const WeekDeal = ({uuid}) => {

    return(
        <Grid item xs={12}>
            <Typography variant='h5' sx={{ my: 2 }}>
                Weekly Deals (Monday to Sunday)
            </Typography>
        </Grid>
    )
};

export default WeekDeal;