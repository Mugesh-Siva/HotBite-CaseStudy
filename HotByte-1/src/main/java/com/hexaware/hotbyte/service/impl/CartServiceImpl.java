package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Cart;
import com.hexaware.hotbyte.service.CartService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class CartServiceImpl implements CartService {

    @Override
    public Cart createCart(Cart cart) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Cart updateCart(Cart cart) throws CartNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteCart(Integer id) throws CartNotFoundException {
    }

    @Override
    public Cart getCartById(Integer id) throws CartNotFoundException {
        return null;
    }

    @Override
    public List<Cart> getAllCarts() {
        return null;
    }
}

