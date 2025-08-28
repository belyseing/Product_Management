import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../types/product';
import { CartAPI, CartStorage } from '../api/cartApi';


interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: number) => boolean;
  loadCartFromAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CART':
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...state,
        items,
        totalItems,
        totalPrice,
        isLoading: false
      };
    
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.product.id === action.payload);
      if (!itemToRemove) return state;
      
      const filteredItems = state.items.filter(item => item.product.id !== action.payload);
      
      return {
        items: filteredItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.product.price * itemToRemove.quantity)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const itemToUpdate = state.items.find(item => item.product.id === action.payload.productId);
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (itemToUpdate.product.price * quantityDiff)
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isLoading: false
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: true
  });

  
  const loadCartFromAPI = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await CartAPI.getCart();
      
     
      const apiItems = cartData.carts[0]?.products || [];
      const items: CartItem[] = apiItems.map((item: any) => ({
        product: item,
        quantity: item.quantity
      }));
      
      dispatch({ type: 'SET_CART', payload: items });
      CartStorage.saveCart(items); 
    } catch (error) {
      console.error('Failed to load cart from API, using localStorage:', error);
     
      const localCart = CartStorage.getCart();
      if (localCart) {
        dispatch({ type: 'SET_CART', payload: localCart });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  useEffect(() => {
    loadCartFromAPI();
  }, []);

  const addToCart = async (product: Product) => {
    try {
    
      dispatch({ type: 'ADD_TO_CART', payload: product });
      

      await CartAPI.addToCart(product.id, 1);
      
    
      const updatedItems = cart.items.find(item => item.product.id === product.id)
        ? cart.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cart.items, { product, quantity: 1 }];
      
      CartStorage.saveCart(updatedItems);
    } catch (error) {
      console.error('Failed to add to cart via API:', error);
      
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
  
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      
    
      await CartAPI.removeFromCart(productId);
      
    
      const updatedItems = cart.items.filter(item => item.product.id !== productId);
      CartStorage.saveCart(updatedItems);
    } catch (error) {
      console.error('Failed to remove from cart via API:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
     
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      
      
      const products = cart.items.map(item => ({
        id: item.product.id,
        quantity: item.quantity
      }));
      
      await CartAPI.updateCart(products);
      
      
      const updatedItems = cart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      CartStorage.saveCart(updatedItems);
    } catch (error) {
      console.error('Failed to update quantity via API:', error);
    }
  };

  const clearCart = async () => {
    try {
     
      dispatch({ type: 'CLEAR_CART' });
      
    
      await CartAPI.clearCart();
      
      
      CartStorage.clearCart();
    } catch (error) {
      console.error('Failed to clear cart via API:', error);
    }
  };

  const isInCart = (productId: number) => {
    return cart.items.some(item => item.product.id === productId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      loadCartFromAPI
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};