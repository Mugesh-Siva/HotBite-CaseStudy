package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Restaurant;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface RestaurantService {
    Restaurant createRestaurant(Restaurant restaurant) throws DuplicateResourceException, InvalidInputException;
    Restaurant updateRestaurant(Restaurant restaurant) throws RestaurantNotFoundException, InvalidInputException;
    void deleteRestaurant(Integer id) throws RestaurantNotFoundException;
    Restaurant getRestaurantById(Integer id) throws RestaurantNotFoundException;
    List<Restaurant> getAllRestaurants();
}

