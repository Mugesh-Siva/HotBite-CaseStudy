package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.MenuItem;
import com.hexaware.hotbyte.service.MenuItemService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class MenuItemServiceImpl implements MenuItemService {

    @Override
    public MenuItem createMenuItem(MenuItem menuitem) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public MenuItem updateMenuItem(MenuItem menuitem) throws MenuItemNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteMenuItem(Integer id) throws MenuItemNotFoundException {
    }

    @Override
    public MenuItem getMenuItemById(Integer id) throws MenuItemNotFoundException {
        return null;
    }

    @Override
    public List<MenuItem> getAllMenuItems() {
        return null;
    }
}

