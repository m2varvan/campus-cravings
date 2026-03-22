import { Typography } from "@mui/material";
import React from "react";

const UserRating = ({rating, uuid}) => {

    return(
       <Typography>{rating.dealName}</Typography>
    );
};

export default UserRating;