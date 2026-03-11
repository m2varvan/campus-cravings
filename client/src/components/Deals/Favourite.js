import { IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Favourite = ({uuid, itemID, fave, saveFave, removeFave }) => {

    const [isFavourited, setIsFavourited] = React.useState(fave);


    const handleFavourite = async () => {

        if (!uuid) return;

        try {

            if (isFavourited) {
                await removeFave(uuid, itemID);
                setIsFavourited(false);
            } else {
                await saveFave(uuid, itemID);
                setIsFavourited(true);
            }

        } catch (error) {
            console.error("Favourite action failed:", error);
        }
    };

    return (
        <IconButton
            onClick={handleFavourite}
            disabled={!uuid}
            data-testid={isFavourited ? "favourite-filled" : "favourite-empty"}
            style={{
                background: "none",
                border: "none",
                cursor: uuid ? "pointer" : "not-allowed",
                fontSize: "20px"
            }}
        >
            {isFavourited ? 
                <FavoriteIcon sx={{ color: "#ba000d" }} data-testid='filled-heart'/> 
            : 
                <FavoriteBorderIcon data-testid='empty-heart'/>
            }
        </IconButton>
    );
}

export default Favourite;

