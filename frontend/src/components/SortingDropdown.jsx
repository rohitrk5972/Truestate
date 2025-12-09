import React from "react";

const SortingDropdown = ({ sort, setSort }) => {
  return (
    <div className="mb-4 flex items-center">
      <label className="mr-2 font-semibold">Sort By:</label>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-1 rounded"
      >
        <option value="">None</option>
        <option value="date">Date → Newest First</option>
        <option value="quantity">Quantity</option>
        <option value="name">Customer Name (A-Z)</option>
      </select>
    </div>
  );
};

export default SortingDropdown;
