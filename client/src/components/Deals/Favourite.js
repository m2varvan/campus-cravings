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
                console.log('Removing Favourite')
                await removeFave(uuid, itemID);
                setIsFavourited(false);
            } else {
                console.log('Adding Favourite')
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
            {isFavourited ? <FavoriteIcon sx={{ color: "#ba000d" }} /> : <FavoriteBorderIcon />}
        </IconButton>
    );
}

export default Favourite;

