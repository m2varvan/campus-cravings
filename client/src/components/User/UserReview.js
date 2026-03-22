import { Typography } from "@mui/material";
import React from "react";

const UserReview = ({review, uuid}) => {

    return(
       <Typography>{review.title}</Typography>
    );
};

export default UserReview;