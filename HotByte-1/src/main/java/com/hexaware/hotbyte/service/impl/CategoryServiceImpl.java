package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Category;
import com.hexaware.hotbyte.service.CategoryService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class CategoryServiceImpl implements CategoryService {

    @Override
    public Category createCategory(Category category) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Category updateCategory(Category category) throws CategoryNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteCategory(Integer id) throws CategoryNotFoundException {
    }

    @Override
    public Category getCategoryById(Integer id) throws CategoryNotFoundException {
        return null;
    }

    @Override
    public List<Category> getAllCategorys() {
        return null;
    }
}

