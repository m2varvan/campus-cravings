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
      placeholder="Search..."
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{ width: 250, mr: 2, bgcolor: "white", borderRadius: 1 }}
    />

  );

}

export default SearchBar;