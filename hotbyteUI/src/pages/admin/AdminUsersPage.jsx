import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser } from '../../services/userService';
import { getAllRoles } from '../../services/roleService';
import '../DashboardPage.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      const roleMap = {};
      if (rolesRes.data) {
        rolesRes.data.forEach(r => {
          roleMap[r.roleId] = r.roleName;
        });
      }
      setRoles(roleMap);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      loadData();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading users...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Users</h1>
            <p className="dashboard-subtitle">View and delete platform users</p>
          </div>
        </div>

        <div className="menu-table-wrapper" style={{ marginTop: '30px' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId}>
                  <td>#{u.userId}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.contactNumber}</td>
                  <td><span className="status-chip">{roles[u.roleId] || u.roleName || 'UNKNOWN'}</span></td>
                  <td>{u.active === true || u.isActive === true ? 'Active' : (u.active === false || u.isActive === false ? 'Inactive' : String(u.active || u.isActive || 'Unknown'))}</td>
                  <td>
                    <button 
                      className="del-btn" 
                      onClick={() => handleDelete(u.userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
