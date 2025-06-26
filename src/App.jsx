import React, { useEffect, useState } from "react";
import {
  fetchProducts,
} from "./services/productService";

function App() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const defaultFilters = { brand: "", category: "", price: "", rating: "" }
  const [filters, setFilters] = useState(defaultFilters);

  // Fetch data from API 
  useEffect(() => {
    fetchProducts()
      .then(products => {
        setData(products);
        setFiltered(products);
      })
      .catch(error => console.log(error));
  }, []);

  // Delete Row
  const handleDelete = (id) => {
    const next = data.filter(p => p.id !== id);
    setData(next);
    applyFilters(next, filters);
  };

  // Title edit 
  const handleEdit = (id, newTitle) => {
    const next = data.map(p =>
      p.id === id ? { ...p, title: newTitle } : p
    );
    setData(next);
    applyFilters(next, filters);
  };

  // Update filters & re-apply
  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    applyFilters(data, nextFilters);
  };

  const applyFilters = (list, { brand, category, price, rating }) => {
    const result = list.filter(item => {
      return (
        (!brand || item.brand === brand) &&
        (!category || item.category === category) &&
        (!price || item.price <= parseFloat(price)) &&
        (!rating || item.rating >= parseFloat(rating))
      );
    });
    setFiltered(result);
  };

  // Reset Filters Function
  const handleResetFilters = () => {
    setFilters(defaultFilters);
    applyFilters(data, defaultFilters);
  };


  // Unique dropdown options
  const getOptions = key =>
    Array.from(new Set(data.map(item => item[key]))).sort();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Products Table</h1>

        {/* Filters */}
        <div className="flex items-end justify-between mb-6">

          <div className="flex flex-wrap items-end gap-6">

            <label className="flex flex-col text-xs font-semibold text-gray-600">
              Brand:
              <select
                className="mt-1 rounded border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                value={filters.brand}
                onChange={e => handleFilterChange("brand", e.target.value)}
              >
                <option value="">All</option>
                {getOptions("brand").map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>


            <label className="flex flex-col text-xs font-semibold text-gray-600">
              Category:
              <select
                className="mt-1 rounded border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                value={filters.category}
                onChange={e => handleFilterChange("category", e.target.value)}
              >
                <option value="">All</option>
                {getOptions("category").map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>


            <label className="flex flex-col text-xs font-semibold text-gray-600">
              Price:
              <input type="number"
                min="0"
                step="5"
                className="mt-1 rounded border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                value={filters.price}
                onChange={e => handleFilterChange("price", e.target.value)}
                placeholder="e.g. $100"
              />
            </label>


            <label className="flex flex-col text-xs font-semibold text-gray-600">
              Rating:
              <input type="number"
                step="0.1"
                min="0"
                max="5"
                className="mt-1 rounded border-gray-300 focus:ring-blue-400 focus:border-blue-400"
                value={filters.rating}
                onChange={e => handleFilterChange("rating", e.target.value)}
                placeholder="e.g. 1"
              />
            </label>

          </div>


          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded transition"
            onClick={handleResetFilters}
            type="button"
          >
            Reset
          </button>


        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Title</th>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Brand</th>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Category</th>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Price</th>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Rating</th>
                <th className="py-2 px-4 font-semibold border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map(row => (
                  <tr key={row.id} className="odd:bg-white even:bg-blue-50 hover:bg-blue-100">
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      className="py-2 px-4 border-b border-gray-100 cursor-text focus:bg-white focus:shadow-inner"
                      onBlur={e => handleEdit(row.id, e.target.textContent)}
                    >
                      {row.title}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-100">{row.brand}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{row.category}</td>
                    <td className="py-2 px-4 border-b border-gray-100">${row.price}</td>
                    <td className="py-2 px-4 border-b border-gray-100">{row.rating}</td>
                    <td>
                      <button className="bg-red-500 hover:bg-red-700 transition text-white text-xs rounded px-3 py-1"
                        onClick={() => handleDelete(row.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;