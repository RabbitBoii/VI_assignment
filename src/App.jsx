import React, { useEffect, useState } from "react";
import {
  fetchAndCacheProducts,
} from "./services/productService";

function App() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ brand: "", category: "", price: "", rating: "" });

  // On mount: fetch → cache → then (after delay) reload from cache
  useEffect(() => {
    fetchAndCacheProducts()
      .then(products => {
        setData(products);
        setFiltered(products);
      })
      .catch(error => console.log(error));
  }, []);

  // Delete a row
  const handleDelete = (id) => {
    const next = data.filter(p => p.id !== id);
    setData(next);
    applyFilters(next, filters);
  };

  // Inline edit (only title in this example)
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

  // Unique dropdown options
  const getOptions = key =>
    Array.from(new Set(data.map(item => item[key]))).sort();

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Products Table</h1>

      {/* Filters */}
      <div style={{ marginBottom: 16 }}>

        <label>
          Brand:
          <select
            value={filters.brand}
            onChange={e => handleFilterChange("brand", e.target.value)}
          >
            <option value="">All</option>
            {/* change the b to brand */}
            {getOptions("brand").map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: 12 }}>
          Category:
          <select
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

        <label style={{ marginLeft: 12 }}>
          Price:

          <input type="number"
            value={filters.price}
            onChange={e => handleFilterChange("price", e.target.value)}
            placeholder="e.g. $100"
          />
          {/* <select
            value={filters.price}
            onChange={e => handleFilterChange("price", e.target.value)}
          >
            <option value="">All</option>
            {getOptions("price").map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select> */}
        </label>

        <label style={{ marginLeft: 12 }}>
          Rating:
          <input type="number"
            value={filters.rating}
            onChange={e => handleFilterChange("rating", e.target.value)}
            placeholder="e.g. 1"

          />
        </label>


      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map(row => (
              <tr key={row.id}>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => handleEdit(row.id, e.target.textContent)}
                >
                  {row.title}
                </td>
                <td>{row.brand}</td>
                <td>{row.category}</td>
                <td>${row.price}</td>
                <td>{row.rating}</td>
                <td>
                  <button onClick={() => handleDelete(row.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;