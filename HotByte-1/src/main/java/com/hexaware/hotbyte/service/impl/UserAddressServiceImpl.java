package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.UserAddress;
import com.hexaware.hotbyte.service.UserAddressService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class UserAddressServiceImpl implements UserAddressService {

    @Override
    public UserAddress createUserAddress(UserAddress useraddress) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public UserAddress updateUserAddress(UserAddress useraddress) throws UserAddressNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteUserAddress(Integer id) throws UserAddressNotFoundException {
    }

    @Override
    public UserAddress getUserAddressById(Integer id) throws UserAddressNotFoundException {
        return null;
    }

    @Override
    public List<UserAddress> getAllUserAddresss() {
        return null;
    }
}

