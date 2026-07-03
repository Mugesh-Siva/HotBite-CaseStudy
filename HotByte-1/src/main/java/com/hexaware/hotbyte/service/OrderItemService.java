package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.OrderItem;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface OrderItemService {
    OrderItem createOrderItem(OrderItem orderitem) throws DuplicateResourceException, InvalidInputException;
    OrderItem updateOrderItem(OrderItem orderitem) throws OrderItemNotFoundException, InvalidInputException;
    void deleteOrderItem(Integer id) throws OrderItemNotFoundException;
    OrderItem getOrderItemById(Integer id) throws OrderItemNotFoundException;
    List<OrderItem> getAllOrderItems();
}

