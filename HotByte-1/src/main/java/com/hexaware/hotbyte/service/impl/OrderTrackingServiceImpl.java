package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.OrderTracking;
import com.hexaware.hotbyte.service.OrderTrackingService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class OrderTrackingServiceImpl implements OrderTrackingService {

    @Override
    public OrderTracking createOrderTracking(OrderTracking ordertracking) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public OrderTracking updateOrderTracking(OrderTracking ordertracking) throws OrderTrackingNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteOrderTracking(Integer id) throws OrderTrackingNotFoundException {
    }

    @Override
    public OrderTracking getOrderTrackingById(Integer id) throws OrderTrackingNotFoundException {
        return null;
    }

    @Override
    public List<OrderTracking> getAllOrderTrackings() {
        return null;
    }
}

