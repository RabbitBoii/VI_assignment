// src/services/productService.js
export const fetchAndCacheProducts = () => {
    return fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(json => {
        // store array of products in localStorage
        localStorage.setItem("products", JSON.stringify(json.products));
        return json.products;
      });
  };
  
  // returns a promise that resolves the cached products after a delay
  export const loadCachedProducts = (delay = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const raw = localStorage.getItem("products");
        if (!raw) return reject(new Error("No products in cache"));
        resolve(JSON.parse(raw));
      }, delay);
    });
  };