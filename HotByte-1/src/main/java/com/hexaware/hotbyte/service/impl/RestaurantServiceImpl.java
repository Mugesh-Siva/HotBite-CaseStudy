package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Restaurant;
import com.hexaware.hotbyte.service.RestaurantService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class RestaurantServiceImpl implements RestaurantService {

    @Override
    public Restaurant createRestaurant(Restaurant restaurant) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Restaurant updateRestaurant(Restaurant restaurant) throws RestaurantNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteRestaurant(Integer id) throws RestaurantNotFoundException {
    }

    @Override
    public Restaurant getRestaurantById(Integer id) throws RestaurantNotFoundException {
        return null;
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return null;
    }
}

