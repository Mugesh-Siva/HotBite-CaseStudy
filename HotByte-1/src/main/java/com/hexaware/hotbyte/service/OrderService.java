package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Order;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface OrderService {
    Order createOrder(Order order) throws DuplicateResourceException, InvalidInputException;
    Order updateOrder(Order order) throws OrderNotFoundException, InvalidInputException;
    void deleteOrder(Integer id) throws OrderNotFoundException;
    Order getOrderById(Integer id) throws OrderNotFoundException;
    List<Order> getAllOrders();
}

