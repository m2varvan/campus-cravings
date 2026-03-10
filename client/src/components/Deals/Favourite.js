import { IconButton } from "@mui/material";
import React from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Favourite = ({type, uuid, itemID, fave, saveFave, removeFave }) => {

    const [isFavourited, setIsFavourited] = React.useState(fave);

    React.useEffect(() => {
        setIsFavourited(fave);
    }, [fave]);

    const handleFavourite = () => {

        if (!uuid) return;

        if (isFavourited) {
            React.removeFavourite?.(type, uuid, itemID);
            setIsFavourited(false);
        } else {
            React.saveFavourite?.(type, uuid, itemID);
            setIsFavourited(true);
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
            {isFavourited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
}

export default Favourite;

