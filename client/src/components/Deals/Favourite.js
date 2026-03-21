import { IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Favourite = ({uuid, itemID, fave, saveFave, removeFave, size='23px' }) => {

    // State to keep track locally if item is favourited or not
    const [isFavourited, setIsFavourited] = React.useState(fave);

    const heartSize = size

    // Sync local state with prop changes
    React.useEffect(() => {
        setIsFavourited(fave);
    }, [fave]);

    const handleFavourite = async () => {
        
        // If no uuid (not signed in) return
        if (!uuid) return;

        try {
            // If the current value is favourited, unfavourite
            if (isFavourited) {
                await removeFave(uuid, itemID);
                setIsFavourited(false);
                console.log('removed fave')
            // If the current value is not favourite, favourite
            } else {
                await saveFave(uuid, itemID);
                setIsFavourited(true);
                console.log('added fave')
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
            }}
        >
            {isFavourited ? 
                <FavoriteIcon sx={{ color: "#ba000d", fontSize: heartSize }} data-testid='filled-heart'/>  // Red heart for favourited
            : 
                <FavoriteBorderIcon sx={{fontSize: heartSize}} data-testid='empty-heart'/> // Outlined heart for not favourited
            }
        </IconButton>
    );
}

export default Favourite;

