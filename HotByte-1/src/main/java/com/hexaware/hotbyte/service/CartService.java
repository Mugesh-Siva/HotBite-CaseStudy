package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Cart;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface CartService {
    Cart createCart(Cart cart) throws DuplicateResourceException, InvalidInputException;
    Cart updateCart(Cart cart) throws CartNotFoundException, InvalidInputException;
    void deleteCart(Integer id) throws CartNotFoundException;
    Cart getCartById(Integer id) throws CartNotFoundException;
    List<Cart> getAllCarts();
}

