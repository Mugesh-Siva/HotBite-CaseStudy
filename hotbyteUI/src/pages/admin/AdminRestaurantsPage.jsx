import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '../../services/restaurantService';
import { registerUser } from '../../services/authService';
import { getAllRoles } from '../../services/roleService';
import '../DashboardPage.css';

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const restRes = await getAllRestaurants();
      setRestaurants(restRes.data);
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
        fullName: '',
        email: '',
        password: '',
        contactNumber: restaurant.contactNumber,
        isActive: restaurant.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        restaurantName: '',
        fullName: '',
        email: '',
        password: '',
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

    try {
      if (editingId) {
        if (!formData.restaurantName || !formData.contactNumber) {
          toast.error('Please fill in all required fields');
          return;
        }
        await updateRestaurant(editingId, {
          restaurantName: formData.restaurantName,
          contactNumber: formData.contactNumber,
          isActive: formData.isActive
        });
        toast.success('Restaurant updated successfully');
      } else {
        if (!formData.restaurantName || !formData.fullName || !formData.email || !formData.password || !formData.contactNumber) {
          toast.error('Please fill in all required fields');
          return;
        }

        const roleRes = await getAllRoles();
        let restaurantRole = roleRes.data.find(r => r.roleName && r.roleName.toUpperCase() === 'RESTAURANT');
        if (!restaurantRole) {
            restaurantRole = roleRes.data.find(r => r.roleName && r.roleName.toLowerCase().includes('restaurant'));
        }
        if (!restaurantRole) {
            // Fallback: commonly 2 is Restaurant
            const fallbackRole = roleRes.data.find(r => r.roleId === 2);
            if (fallbackRole) {
              restaurantRole = fallbackRole;
            } else {
              toast.error("Restaurant role not found in database. Roles available: " + roleRes.data.map(r => r.roleName).join(", "));
              return;
            }
        }

        const userPayload = {
            roleId: restaurantRole.roleId,
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            contactNumber: formData.contactNumber,
            gender: 'Not Specified'
        };
        const authRes = await registerUser(userPayload);
        const newUserId = authRes.data.userId;

        const restPayload = {
            restaurantName: formData.restaurantName,
            ownerUserId: newUserId,
            contactNumber: formData.contactNumber,
            isActive: formData.isActive
        };
        await createRestaurant(restPayload);

        toast.success('Restaurant and owner account created successfully');
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data || 'Operation failed');
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

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
              <form onSubmit={handleSubmit}>
                
                <h4 style={{ marginBottom: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>Restaurant Details</h4>
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
                  <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant Contact Number *</label>
                  <input 
                    type="text" 
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>

                {!editingId && (
                  <>
                    <h4 style={{ marginBottom: '10px', marginTop: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '5px' }}>Owner Account Details</h4>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Owner Full Name *</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        required={!editingId}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Owner Email *</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        required={!editingId}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Owner Password *</label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        required={!editingId}
                        minLength={6}
                      />
                    </div>
                  </>
                )}

                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', marginTop: '15px' }}>
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
                    {editingId ? 'Update Restaurant' : 'Create Restaurant & Owner'}
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
