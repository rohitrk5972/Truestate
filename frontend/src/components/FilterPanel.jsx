import React, { useState } from "react";

const FilterPanel = ({ filters, setFilters }) => {
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");

  const applyFilters = () => {
    setFilters({ region, gender });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Filters</h2>

      <div className="mb-2">
        <label>Region</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border p-1 rounded"
        >
          <option value="">All</option>
          <option value="North">North</option>
          <option value="South">South</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border p-1 rounded"
        >
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <button
        onClick={applyFilters}
        className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterPanel;
