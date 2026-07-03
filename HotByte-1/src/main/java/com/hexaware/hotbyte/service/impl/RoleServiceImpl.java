package com.hexaware.hotbyte.service.impl;

import com.hexaware.hotbyte.entity.Role;
import com.hexaware.hotbyte.service.RoleService;
import java.util.List;
import com.hexaware.hotbyte.exception.*;

public class RoleServiceImpl implements RoleService {

    @Override
    public Role createRole(Role role) throws DuplicateResourceException, InvalidInputException {
        return null;
    }

    @Override
    public Role updateRole(Role role) throws RoleNotFoundException, InvalidInputException {
        return null;
    }

    @Override
    public void deleteRole(Integer id) throws RoleNotFoundException {
    }

    @Override
    public Role getRoleById(Integer id) throws RoleNotFoundException {
        return null;
    }

    @Override
    public List<Role> getAllRoles() {
        return null;
    }
}

