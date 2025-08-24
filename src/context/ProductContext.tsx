import React, { createContext, ReactNode, useState, useEffect } from "react";
import type { Product } from "../types/product";
import { getProducts, addProduct, updateProduct, deleteProduct, searchProducts } from "../api/productApi";

interface ProductContextType {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addNewProduct: (product: Partial<Product>) => Promise<void>;
  updateExistingProduct: (id: number, data: Partial<Product>) => Promise<void>;
  deleteExistingProduct: (id: number) => Promise<void>;
  searchProduct: (query: string) => Promise<void>;
}

 const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const addNewProduct = async (product: Partial<Product>) => {
    const newProduct = await addProduct(product);
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateExistingProduct = async (id: number, data: Partial<Product>) => {
    const updated = await updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteExistingProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const searchProduct = async (query: string) => {
    const filtered = await searchProducts(query);
    setProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, fetchProducts, addNewProduct, updateExistingProduct, deleteExistingProduct, searchProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export {ProductContext}