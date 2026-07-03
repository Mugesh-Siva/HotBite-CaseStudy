package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.CartItem;
import com.hexaware.hotbyte.service.CartItemService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class CartItemServiceImpl implements CartItemService {

    @Override
    public CartItem createCartItem(CartItem cartitem) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public CartItem updateCartItem(CartItem cartitem) throws CartItemNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteCartItem(Integer id) throws CartItemNotFoundException {
    }

    @Override
    public CartItem getCartItemById(Integer id) throws CartItemNotFoundException {
        return null;
    }

    @Override
    public List<CartItem> getAllCartItems() {
        return null;
    }
}

