import { IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Favourite = ({uuid, itemID, fave, saveFave, removeFave }) => {

    // State to keep track locally if item is favourited or not
    const [isFavourited, setIsFavourited] = React.useState(fave);


    const handleFavourite = async () => {
        
        // If no uuid (not signed in) return
        if (!uuid) return;

        try {
            // If the current value is favourited, unfavourite
            if (isFavourited) {
                await removeFave(uuid, itemID);
                setIsFavourited(false);
            // If the current value is not favourite, favourite
            } else {
                await saveFave(uuid, itemID);
                setIsFavourited(true);
            }

        } catch (error) {
            console.error("Favourite action failed:", error);
        }
    };

    return (
        // Icon button to fav/unfavorite
        <IconButton
            onClick={handleFavourite}
            disabled={!uuid} // Disable if not logged in
            data-testid={isFavourited ? "favourite-filled" : "favourite-empty"} 
            style={{
                background: "none",
                border: "none",
                cursor: uuid ? "pointer" : "not-allowed",
                fontSize: "20px"
            }}
        >
            {isFavourited ? 
                <FavoriteIcon sx={{ color: "#ba000d" }} data-testid='filled-heart'/>  // Red heart for favourited
            : 
                <FavoriteBorderIcon data-testid='empty-heart'/> // Outlined heart for not favourited
            }
        </IconButton>
    );
}

export default Favourite;

