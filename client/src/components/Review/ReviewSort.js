import React from "react";

function ReviewSort({ sortType, setSortType }) {

  const handleChange = (e) => {
    setSortType(e.target.value);
  };

  return (

    <div style={{marginBottom:"10px"}}>

      <label>Sort By: </label>

      <select value={sortType} onChange={handleChange}>

        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="mostHelpful">Most Helpful</option>
        <option value="leastHelpful">Least Helpful</option>

      </select>

    </div>
  );
}

export default ReviewSort;