package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.User;
import com.hexaware.hotbyte.service.UserService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class UserServiceImpl implements UserService {

    @Override
    public User createUser(User user) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public User updateUser(User user) throws UserNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteUser(Integer id) throws UserNotFoundException {
    }

    @Override
    public User getUserById(Integer id) throws UserNotFoundException {
        return null;
    }

    @Override
    public List<User> getAllUsers() {
        return null;
    }
}

