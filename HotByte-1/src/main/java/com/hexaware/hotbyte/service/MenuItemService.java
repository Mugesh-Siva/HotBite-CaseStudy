package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.MenuItem;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface MenuItemService {
    MenuItem createMenuItem(MenuItem menuitem) throws DuplicateResourceException, InvalidInputException;
    MenuItem updateMenuItem(MenuItem menuitem) throws MenuItemNotFoundException, InvalidInputException;
    void deleteMenuItem(Integer id) throws MenuItemNotFoundException;
    MenuItem getMenuItemById(Integer id) throws MenuItemNotFoundException;
    List<MenuItem> getAllMenuItems();
}

