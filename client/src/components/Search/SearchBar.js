import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SearchBar() {

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && query.trim()) {

      navigate(`/search?q=${encodeURIComponent(query)}`);

    }

  };

  return (

    <TextField
      size="small"
      placeholder="Search Users, Deals, Restaurants..."
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{ minWidth: 200, width: { xs: '100%', sm: 360 }, mr: 2, bgcolor: 'white', borderRadius: 1 }}
      inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
    />

  );

}

export default SearchBar;