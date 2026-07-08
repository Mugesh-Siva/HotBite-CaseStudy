// CartContext - manages cart state (items, total) globally
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAllCartItems, getAllCarts, addCartItem, updateCartItem, deleteCartItem, createCart } from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);     // Array of cart item objects
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setCartItems([]);
      setCartId(null);
    }
  }, [isAuthenticated, user]);

  const loadCart = async (background = false) => {
    if (!user) return;
    if (!background) setLoading(true);
    try {
      // Get all carts and find the one for this user
      const cartsRes = await getAllCarts();
      const userCart = cartsRes.data.find(c => c.userId === user.userId);

      if (userCart) {
        setCartId(userCart.cartId);
        // Get all cart items and filter by this cart
        const itemsRes = await getAllCartItems();
        const myItems = itemsRes.data.filter(i => i.cartId === userCart.cartId);
        setCartItems(myItems);
      } else {
        // Create cart for user
        const newCart = await createCart({ userId: user.userId });
        setCartId(newCart.data.cartId);
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      if (!background) setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (menuItem) => {
    if (!cartId) return;
    try {
      // Check if item already exists
      const existing = cartItems.find(i => Number(i.menuItemId) === Number(menuItem.menuItemId));
      if (existing) {
        await updateCartItem(existing.cartItemId, {
          cartId,
          menuItemId: menuItem.menuItemId,
          quantity: existing.quantity + 1,
          unitPrice: menuItem.discountPrice || menuItem.price,
        });
      } else {
        await addCartItem({
          cartId,
          menuItemId: menuItem.menuItemId,
          quantity: 1,
          unitPrice: menuItem.discountPrice || menuItem.price,
        });
      }
      await loadCart(true);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    try {
      let priceToUpdate = item.unitPrice;
      // Fallback if price is corrupted/null in older DB records
      if (!priceToUpdate) {
        const { getMenuItemById } = await import('../services/menuService');
        const menuRes = await getMenuItemById(item.menuItemId);
        priceToUpdate = menuRes.data.discountPrice || menuRes.data.price;
      }

      await updateCartItem(cartItemId, {
        cartId,
        menuItemId: item.menuItemId,
        quantity,
        unitPrice: priceToUpdate,
      });
      await loadCart(true);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId);
      await loadCart(true);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  // Clear cart after order
  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartId, loading,
      addToCart, updateQuantity, removeFromCart, clearCart,
      totalAmount, itemCount, loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
