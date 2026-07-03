package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.RestaurantAddress;
import com.hexaware.hotbyte.service.RestaurantAddressService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class RestaurantAddressServiceImpl implements RestaurantAddressService {

    @Override
    public RestaurantAddress createRestaurantAddress(RestaurantAddress restaurantaddress) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public RestaurantAddress updateRestaurantAddress(RestaurantAddress restaurantaddress) throws RestaurantAddressNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteRestaurantAddress(Integer id) throws RestaurantAddressNotFoundException {
    }

    @Override
    public RestaurantAddress getRestaurantAddressById(Integer id) throws RestaurantAddressNotFoundException {
        return null;
    }

    @Override
    public List<RestaurantAddress> getAllRestaurantAddresss() {
        return null;
    }
}

