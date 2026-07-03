package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.User;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface UserService {
    User createUser(User user) throws DuplicateResourceException, InvalidInputException;
    User updateUser(User user) throws UserNotFoundException, InvalidInputException;
    void deleteUser(Integer id) throws UserNotFoundException;
    User getUserById(Integer id) throws UserNotFoundException;
    List<User> getAllUsers();
}

