import React from "react";
import { Typography, Stack, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

const DealVote = ({uuid, totalVote, userVote, dealID, }) => {

    // Local states to track the user's vote and the total vote
    const [displayedUserVote, setDisplayedUserVote] = React.useState(userVote)
    const [displayedTotalVote, setDisplayedTotalVote] = React.useState(totalVote)

    // API to add / edit vote
    const onVote = async (vote) => {

        // Do not make API call if vote is same as the user's current vote
        if (vote === displayedUserVote){
            return
        }

        try {
            console.log('Vote', vote)

            const body = {
                        userID: uuid, 
                        dealID: dealID, 
                        vote: vote, 
                        update: displayedUserVote ? true : false
                    }

            const response = await fetch("/api/vote", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            // Update local states
            setDisplayedUserVote(vote)
            if (!displayedUserVote || displayedUserVote === 0) {
                setDisplayedUserVote(vote)
                setDisplayedTotalVote(displayedTotalVote + vote)
            } else if (displayedUserVote === 1 ){
                setDisplayedTotalVote(displayedTotalVote - (vote + 1))
            } else if (displayedUserVote === -1){
                setDisplayedTotalVote(displayedTotalVote + (vote + 1))
            }


            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

        } catch (error) {
            console.error("Failed to record vote:", error);
        }

    };


    return(
        <Stack direction="row" alignItems="center" spacing={0}>
        
            {/* Upvote Button */}
            <IconButton
                size="small"
                aria-label="upvote"
                disabled={!uuid}
                onClick={() => onVote(displayedUserVote === 1 ? 0 : 1)}
            >
                {displayedUserVote === 1 ? 
                    <ThumbUpIcon fontSize="small" data-testid='thumbs-up-filled'/> 
                : 
                    <ThumbUpOutlinedIcon fontSize="small" data-testid='thumbs-up-empty' />}
            </IconButton>
            
            {/* Total Votes Count */}
            <Typography variant="subtitle2">
                {displayedTotalVote}
            </Typography>

            {/* Downvote Button */}
            <IconButton
                size="small"
                aria-label="downvote"
                disabled={!uuid}
                onClick={() => onVote(displayedUserVote === -1 ? 0 : -1)}
            >
                {displayedUserVote === -1 ?
                    <ThumbDownIcon fontSize="small" data-testid='thumbs-down-filled'/> 
                : 
                    <ThumbDownOutlinedIcon fontSize="small" data-testid='thumbs-down-empty'/>}
            </IconButton>

        </Stack>
    )
}

export default DealVote;

