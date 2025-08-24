import axios from 'axios';


const API_BASE = 'https://dummyjson.com/carts';


const USER_ID = 1; 
export const CartAPI = {

  getCart: async (userId: number = USER_ID) => {
    try {
      const response = await axios.get(`${API_BASE}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },


  addToCart: async (productId: number, quantity: number = 1, userId: number = USER_ID) => {
    try {
      const response = await axios.post(`${API_BASE}/add`, {
        userId: userId,
        products: [
          {
            id: productId,
            quantity: quantity,
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateCart: async (products: Array<{ id: number; quantity: number }>, userId: number = USER_ID) => {
    try {
      const response = await axios.put(`${API_BASE}/${userId}`, {
        merge: true,
        products: products
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

 
  removeFromCart: async (productId: number, userId: number = USER_ID) => {
    try {
     
      const cartResponse = await axios.get(`${API_BASE}/user/${userId}`);
      const currentCart = cartResponse.data.carts[0];
      
      const updatedProducts = currentCart.products.filter((product: any) => product.id !== productId);
      
      const response = await axios.put(`${API_BASE}/${userId}`, {
        products: updatedProducts
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },


  clearCart: async (userId: number = USER_ID) => {
    try {
      const response = await axios.delete(`${API_BASE}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};


export const CartStorage = {
  getCart: (): any => {
    if (typeof window === 'undefined') return null;
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : null;
  },

  saveCart: (cartData: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cartData));
  },

  clearCart: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
  }
};