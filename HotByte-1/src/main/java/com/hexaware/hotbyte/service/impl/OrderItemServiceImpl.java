package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.OrderItem;
import com.hexaware.hotbyte.service.OrderItemService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class OrderItemServiceImpl implements OrderItemService {

    @Override
    public OrderItem createOrderItem(OrderItem orderitem) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public OrderItem updateOrderItem(OrderItem orderitem) throws OrderItemNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteOrderItem(Integer id) throws OrderItemNotFoundException {
    }

    @Override
    public OrderItem getOrderItemById(Integer id) throws OrderItemNotFoundException {
        return null;
    }

    @Override
    public List<OrderItem> getAllOrderItems() {
        return null;
    }
}

