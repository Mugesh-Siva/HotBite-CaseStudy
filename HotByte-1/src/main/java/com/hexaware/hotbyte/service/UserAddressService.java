package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.UserAddress;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface UserAddressService {
    UserAddress createUserAddress(UserAddress useraddress) throws DuplicateResourceException, InvalidInputException;
    UserAddress updateUserAddress(UserAddress useraddress) throws UserAddressNotFoundException, InvalidInputException;
    void deleteUserAddress(Integer id) throws UserAddressNotFoundException;
    UserAddress getUserAddressById(Integer id) throws UserAddressNotFoundException;
    List<UserAddress> getAllUserAddresss();
}

