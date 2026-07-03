package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Order;
import com.hexaware.hotbyte.service.OrderService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class OrderServiceImpl implements OrderService {

    @Override
    public Order createOrder(Order order) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Order updateOrder(Order order) throws OrderNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteOrder(Integer id) throws OrderNotFoundException {
    }

    @Override
    public Order getOrderById(Integer id) throws OrderNotFoundException {
        return null;
    }

    @Override
    public List<Order> getAllOrders() {
        return null;
    }
}

