// src/services/productService.js

export const fetchProducts = () => {
  return fetch("https://dummyjson.com/products")
    .then(res => {
      if (!res.ok) {
        throw new Error("Network Response was not okay.")
      }
      return res.json()
    })
    .then(json => {
      // store array of products in local storage
      localStorage.setItem("products", JSON.stringify(json.products));
      return json.products;
    });
};

