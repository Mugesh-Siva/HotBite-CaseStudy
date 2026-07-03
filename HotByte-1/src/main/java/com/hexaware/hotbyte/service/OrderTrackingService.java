package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.OrderTracking;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface OrderTrackingService {
    OrderTracking createOrderTracking(OrderTracking ordertracking) throws DuplicateResourceException, InvalidInputException;
    OrderTracking updateOrderTracking(OrderTracking ordertracking) throws OrderTrackingNotFoundException, InvalidInputException;
    void deleteOrderTracking(Integer id) throws OrderTrackingNotFoundException;
    OrderTracking getOrderTrackingById(Integer id) throws OrderTrackingNotFoundException;
    List<OrderTracking> getAllOrderTrackings();
}

