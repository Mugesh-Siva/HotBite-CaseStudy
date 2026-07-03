package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.RestaurantAddress;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface RestaurantAddressService {
    RestaurantAddress createRestaurantAddress(RestaurantAddress restaurantaddress) throws DuplicateResourceException, InvalidInputException;
    RestaurantAddress updateRestaurantAddress(RestaurantAddress restaurantaddress) throws RestaurantAddressNotFoundException, InvalidInputException;
    void deleteRestaurantAddress(Integer id) throws RestaurantAddressNotFoundException;
    RestaurantAddress getRestaurantAddressById(Integer id) throws RestaurantAddressNotFoundException;
    List<RestaurantAddress> getAllRestaurantAddresss();
}

