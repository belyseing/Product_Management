// import axios from "axios";

// const API_URL = "https://dummyjson.com/products";



// export const getProducts = async () => {
//    const response = await axios.get(API_URL)
//    return response.data.products;
// };



// export const getProductById = async (id: number) => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };


// export const getCategories = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/categories`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };



// export const getProductsByCategory = async (category: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/category/${category}`);
//     return response.data.products;
//   } catch (error) {
//     console.error('Error fetching products by category:', error);
//     throw error;
//   }
// };

// export const addProduct = async (productData: object) => {
//     const response = await axios.post(API_URL + "/add", productData)
//     return response.data;
// }

// export const updateProduct = async (id: number, updatedData: object) => {
//   const response = await axios.put(`${API_URL}/${id}`, updatedData);
//   return response.data;
// };



// export const deleteProduct = async (id: number) => {
//     const response = await axios.delete(`${API_URL}/${id}`)
//     return response.data
// }



// export const searchProducts = async (query: string) => {
//   const response = await axios.get(`${API_URL}/search?q=${query}`);
//   return response.data.products;
// };