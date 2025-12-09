import React from "react";

const CustomerTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Region</th>
            <th className="px-4 py-2 text-left">Gender</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Qty</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center" colSpan="6">No data found</td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c._id || c.customerId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{c.customerName}</td>
                <td className="px-4 py-2">{c.phoneNumber}</td>
                <td className="px-4 py-2">{c.customerRegion}</td>
                <td className="px-4 py-2">{c.gender}</td>
                <td className="px-4 py-2">{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2">{c.quantity ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
