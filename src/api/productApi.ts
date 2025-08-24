import axios from "axios";

const API_URL = "https://dummyjson.com/products";


// all product
export const getProducts = async () => {
   const response = await axios.get(API_URL)
   return response.data.products;
};


// product by id
export const getProductById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};


// add new product
export const addProduct = async (productData: object) => {
    const response = await axios.post(API_URL + "/add", productData)
    return response.data;
}

// update/edit product
export const updateProduct = async (id: number, updatedData: object) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// delete product

export const deleteProduct = async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
}

// search and filter product

export const searchProducts = async (query: string) => {
  const response = await axios.get(`${API_URL}/search?q=${query}`);
  return response.data.products;
};