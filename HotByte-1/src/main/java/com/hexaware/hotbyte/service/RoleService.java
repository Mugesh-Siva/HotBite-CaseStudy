package com.hexaware.hotbyte.service;

import com.hexaware.hotbyte.entity.Role;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public interface RoleService {
    Role createRole(Role role) throws DuplicateResourceException, InvalidInputException;
    Role updateRole(Role role) throws RoleNotFoundException, InvalidInputException;
    void deleteRole(Integer id) throws RoleNotFoundException;
    Role getRoleById(Integer id) throws RoleNotFoundException;
    List<Role> getAllRoles();
}

