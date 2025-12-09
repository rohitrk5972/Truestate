import React, { useState, useEffect } from "react";
import { fetchCustomers } from "./services/api.js";

function Sidebar({ sidebarOpen, setSidebarOpen, activeItem, setActiveItem }) {
  const menu = ["Dashboard", "Customers", "Sales", "Products", "Reports", "Settings"];

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      aria-hidden={!sidebarOpen && typeof window !== "undefined" && window.innerWidth < 768}
    >
      {/* User Info */}
      <div className="mb-6 flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl shadow">
        <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
          R
        </div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Rohit Kumar</div>
      </div>

      {/* Navigation */}
      <nav className="text-sm space-y-1">
        {menu.map((item) => {
          const isActive = activeItem === item;
          return (
            <button
              key={item}
              onClick={() => {
                setActiveItem(item);
                if (typeof window !== "undefined" && window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`w-full text-left py-2 px-2 rounded flex items-center gap-3 focus:outline-none transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-700 text-indigo-700 dark:text-white font-medium"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="inline-block w-6 text-center text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                {item.charAt(0)}
              </span>
              <span className="truncate">{item}</span>
            </button>
          );
        })}

        <div className="mt-4 text-xs text-gray-400 uppercase tracking-wide">Invoices</div>
        <div className="pl-1">
          <button
            onClick={() => {
              setActiveItem("Proforma Invoices");
              if (typeof window !== "undefined" && window.innerWidth < 768) setSidebarOpen(false);
            }}
            className="py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left text-gray-700 dark:text-gray-200"
          >
            Proforma Invoices
          </button>
          <button
            onClick={() => {
              setActiveItem("Final Invoices");
              if (typeof window !== "undefined" && window.innerWidth < 768) setSidebarOpen(false);
            }}
            className="py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left text-gray-700 dark:text-gray-200"
          >
            Final Invoices
          </button>
        </div>
      </nav>
    </aside>
  );
}

function App() {
  const itemsPerPage = 10;

  // -----------------------------------------
  //  THEME START (Light / Dark Mode Toggle)
  // -----------------------------------------
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  // -----------------------------------------
  //  THEME END
  // -----------------------------------------

  const initialData = [
    { customerId: 1, customerName: "John Doe", phoneNumber: "1234567890", customerRegion: "North", gender: "Male", productCategory: "Electronics", tags: ["New"], paymentMethod: "Cash", date: "2025-12-01", quantity: 5 },
    { customerId: 2, customerName: "Jane Smith", phoneNumber: "9876543210", customerRegion: "South", gender: "Female", productproductCategory: "Furniture", tags: ["Sale"], paymentMethod: "Card", date: "2025-12-03", quantity: 2 },
    { customerId: 3, customerName: "Alice Johnson", phoneNumber: "5555555555", customerRegion: "North", gender: "Female", productCategory: "Electronics", tags: ["New", "Sale"], paymentMethod: "Cash", date: "2025-12-02", quantity: 10 },
    { customerId: 4, customerName: "Bob Williams", phoneNumber: "4444444444", customerRegion: "South", gender: "Male", productCategory: "Furniture", tags: ["New"], paymentMethod: "Card", date: "2025-12-04", quantity: 7 },
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // ------------------------
  // FETCH BACKEND DATA
  // ------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchCustomers({ page: 1, limit: 1000 });
        if (Array.isArray(res?.data)) {
          const normalized = res.data.map((r) => ({
            customerId: r.customerId ?? r._id,
            customerName: r.customerName ?? "",
            phoneNumber: r.phoneNumber ?? "",
            customerRegion: r.customerRegion ?? "",
            gender: r.gender ?? "",
            productCategory: r.productCategory ?? "-",
            tags: r.tags ?? [],
            paymentMethod: r.paymentMethod ?? "-",
            date: r.date ?? "-",
            quantity: r.quantity ?? 0,
          }));
          setData(normalized);
        }
      } catch (err) {
        console.error("Backend fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ------------------------
  // FILTER + SEARCH
  // ------------------------
  const filteredData = data.filter((item) => {
    const q = search.toLowerCase();
    const name = (item.customerName || "").toLowerCase();
    const phone = (item.phoneNumber || "").toLowerCase();

    const matchesSearch = q === "" || name.startsWith(q) || phone.startsWith(q);

    const matchesRegion = filters.region ? item.customerRegion === filters.region : true;
    const matchesGender = filters.gender ? item.gender === filters.gender : true;
    const matchesTag = filters.tag ? item.tags.includes(filters.tag) : true;
    const matchesPayment = filters.payment ? item.paymentMethod === filters.payment : true;
    const matchesQuantity = filters.quantity ? item.quantity === Number(filters.quantity) : true;
    const matchesDate = filters.date ? item.date === filters.date : true;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesGender &&
      matchesTag &&
      matchesPayment &&
      matchesQuantity &&
      matchesDate
    );
  });

  // ------------------------
  // SORTING
  // ------------------------
  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "name") return a.customerName.localeCompare(b.customerName);
    if (sort === "date") return new Date(b.date) - new Date(a.date);
    if (sort === "quantity") return a.quantity - b.quantity;
    return 0;
  });

  // ------------------------
  // PAGINATION
  // ------------------------
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setSearch("");
    setSort("");
    setPage(1);
  };

  // ------------------------
  // Dashboard cards totals
  // ------------------------
  const totalUnits = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalTransactions = data.length;
  const totalRevenue = 89000;
  const totalDiscount = 15000;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-all text-gray-900 dark:text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header + Theme toggle */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Sales Management System</h1>

            {/* 🌙 Toggle button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
            </button>
          </div>

          {/* Dashboard cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-6 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 flex flex-col justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Units Sold</div>
              <div className="mt-2 text-2xl font-bold">{totalUnits}</div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-6 rounded-2xl shadow-lg border border-green-200 dark:border-green-700 flex flex-col justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</div>
              <div className="mt-2 text-2xl font-bold">₹{totalRevenue}</div>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900 dark:to-red-800 p-6 rounded-2xl shadow-lg border border-red-200 dark:border-red-700 flex flex-col justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Discount</div>
              <div className="mt-2 text-2xl font-bold">₹{totalDiscount}</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800 p-6 rounded-2xl shadow-lg border border-yellow-200 dark:border-yellow-700 flex flex-col justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">Transactions</div>
              <div className="mt-2 text-2xl font-bold">{totalTransactions}</div>
            </div>
          </div>

          {/* Filters + search + sort */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
              <input
                placeholder="Search name/phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-2 py-1 rounded bg-white dark:bg-gray-700"
              />

              <select value={filters.region || ""} onChange={(e) => handleFilterChange("region", e.target.value || undefined)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700">
                <option value="">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>

              <select value={filters.gender || ""} onChange={(e) => handleFilterChange("gender", e.target.value || undefined)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700">
                <option value="">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select value={filters.tag || ""} onChange={(e) => handleFilterChange("tag", e.target.value || undefined)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700">
                <option value="">All Tags</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
              </select>

              <select value={filters.payment || ""} onChange={(e) => handleFilterChange("payment", e.target.value || undefined)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700">
                <option value="">All Payment</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>

              <input type="date" value={filters.date || ""} onChange={(e) => handleFilterChange("date", e.target.value || undefined)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700" />

              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-2 py-1 rounded bg-white dark:bg-gray-700">
                <option value="">Sort By</option>
                <option value="name">Name A-Z</option>
                <option value="date">Date Newest</option>
                <option value="quantity">Quantity</option>
              </select>
            </div>

            <button onClick={resetFilters} className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded">
              Reset Filters
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
            {loading ? (
              <div className="text-center py-4">Loading data...</div>
            ) : (
              <table className="min-w-full border">
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 border">Name</th>
                    <th className="px-3 py-2 border">Phone</th>
                    <th className="px-3 py-2 border">Gender</th>
                    <th className="px-3 py-2 border">Region</th>
                    <th className="px-3 py-2 border">Product Category</th>
                    <th className="px-3 py-2 border">Tags</th>
                    <th className="px-3 py-2 border">Quantity</th>
                    <th className="px-3 py-2 border">Payment</th>
                    <th className="px-3 py-2 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.customerId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 border">{item.customerName}</td>
                        <td className="px-3 py-2 border">{item.phoneNumber}</td>
                        <td className="px-3 py-2 border">{item.gender}</td>
                        <td className="px-3 py-2 border">{item.customerRegion}</td>
                        <td className="px-3 py-2 border">{item.productCategory}</td>
                        <td className="px-3 py-2 border">{item.tags.join(", ")}</td>
                        <td className="px-3 py-2 border">{item.quantity}</td>
                        <td className="px-3 py-2 border">{item.paymentMethod}</td>
                        <td className="px-3 py-2 border">{item.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50">
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;