package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Category;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface CategoryService {
    Category createCategory(Category category) throws DuplicateResourceException, InvalidInputException;
    Category updateCategory(Category category) throws CategoryNotFoundException, InvalidInputException;
    void deleteCategory(Integer id) throws CategoryNotFoundException;
    Category getCategoryById(Integer id) throws CategoryNotFoundException;
    List<Category> getAllCategorys();
}

