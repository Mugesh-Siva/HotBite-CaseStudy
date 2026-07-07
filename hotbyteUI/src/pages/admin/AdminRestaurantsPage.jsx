import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../api/restaurantApi';
import { getAllUsers } from '../../api/userApi';
import '../DashboardPage.css';

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerUserId: '',
    contactNumber: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [restRes, usersRes] = await Promise.all([
        getAllRestaurants(),
        getAllUsers()
      ]);
      setRestaurants(restRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      await deleteRestaurant(id);
      toast.success('Restaurant deleted');
      loadData();
    } catch { 
      toast.error('Failed to delete restaurant'); 
    }
  };

  const handleOpenModal = (restaurant = null) => {
    if (restaurant) {
      setEditingId(restaurant.restaurantId);
      setFormData({
        restaurantName: restaurant.restaurantName,
        ownerUserId: restaurant.ownerUserId,
        contactNumber: restaurant.contactNumber,
        isActive: restaurant.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        restaurantName: '',
        ownerUserId: '',
        contactNumber: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.restaurantName || !formData.ownerUserId || !formData.contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateRestaurant(editingId, formData);
        toast.success('Restaurant updated successfully');
      } else {
        await createRestaurant(formData);
        toast.success('Restaurant created successfully');
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.contactNumber.includes(searchQuery)
  );

  if (loading) return <div className="dashboard-loading">Loading restaurants...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title">Manage Restaurants</h1>
            <p className="dashboard-subtitle">Add, edit, or remove restaurants</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Restaurant
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search restaurants..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
        </div>

        <div className="menu-table-wrapper">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Owner ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map(r => (
                <tr key={r.restaurantId}>
                  <td>#{r.restaurantId}</td>
                  <td>{r.restaurantName}</td>
                  <td>{r.contactNumber}</td>
                  <td>User #{r.ownerUserId}</td>
                  <td>{r.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button 
                      onClick={() => handleOpenModal(r)}
                      style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="del-btn" 
                      onClick={() => handleDelete(r.restaurantId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRestaurants.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No restaurants found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Simple Bootstrap-style Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant Name *</label>
                  <input 
                    type="text" 
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Owner *</label>
                  <select 
                    value={formData.ownerUserId}
                    onChange={(e) => setFormData({...formData, ownerUserId: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  >
                    <option value="">Select an Owner</option>
                    {users.map(u => (
                      <option key={u.userId} value={u.userId}>#{u.userId} - {u.fullName} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Contact Number *</label>
                  <input 
                    type="text" 
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    id="isActiveCheck"
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor="isActiveCheck">Active Restaurant</label>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    style={{ padding: '10px 15px', border: '1px solid var(--border)', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ padding: '10px 15px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminRestaurantsPage;
