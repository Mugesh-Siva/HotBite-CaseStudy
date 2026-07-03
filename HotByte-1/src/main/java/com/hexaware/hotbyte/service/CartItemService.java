package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.CartItem;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface CartItemService {
    CartItem createCartItem(CartItem cartitem) throws DuplicateResourceException, InvalidInputException;
    CartItem updateCartItem(CartItem cartitem) throws CartItemNotFoundException, InvalidInputException;
    void deleteCartItem(Integer id) throws CartItemNotFoundException;
    CartItem getCartItemById(Integer id) throws CartItemNotFoundException;
    List<CartItem> getAllCartItems();
}

