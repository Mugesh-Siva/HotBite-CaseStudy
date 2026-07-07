// RestaurantDashboardPage - Restaurant owner dashboard
// Tabs: Menu Management | Orders | Analytics
// Uses Formik + Yup for add menu form

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getAllCategories, uploadMenuImages } from '../api/menuApi';
import { getAllOrders, updateOrder } from '../api/orderApi';
import { getAllRestaurants } from '../api/restaurantApi';
import './DashboardPage.css';

/**
 * Safely parse a date from Spring Boot:
 *   - ISO string "2025-07-07T10:30:00"
 *   - Java array  [2025, 7, 7, 10, 30, 0]
 */
const parseDate = (raw) => {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const [y, mo, d, h = 0, mi = 0] = raw;
    return new Date(y, mo - 1, d, h, mi);
  }
  const dt = new Date(raw);
  return isNaN(dt.getTime()) ? null : dt;
};

const formatDateIST = (raw) => {
  const dt = parseDate(raw);
  if (!dt) return '—';
  return dt.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};


// Yup schema for add menu form
const menuSchema = Yup.object({
  itemName: Yup.string().required('Item name is required'),
  description: Yup.string().min(50, 'Minimum 50 characters').max(250, 'Maximum 250 characters').required('Description is required'),
  categoryId: Yup.number().required('Category is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  discountPrice: Yup.number().positive('Discount price must be positive').nullable(),
  availabilityTime: Yup.string().required('Availability time is required'),
  dietaryInfo: Yup.string().required('Dietary info is required'),
  tasteInfo: Yup.string().required('Taste info is required'),
  nutritionalInfo: Yup.string(),
});

const RestaurantDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [catRes, menuRes, orderRes, restRes] = await Promise.all([
        getAllCategories(),
        getAllMenuItems(),
        getAllOrders(),
        getAllRestaurants(),
      ]);
      setCategories(catRes.data);

      // Find restaurant owned by this user
      const myRestaurant = restRes.data.find(r => r.ownerUserId === user?.userId);
      if (myRestaurant) {
        setRestaurantId(myRestaurant.restaurantId);
        const myMenu = menuRes.data.filter(m => m.restaurantId === myRestaurant.restaurantId);
        setMenuItems(myMenu);
        const myOrders = orderRes.data.filter(o => o.restaurantId === myRestaurant.restaurantId);
        setOrders(myOrders.sort((a, b) => b.orderId - a.orderId));
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      itemName: editingItem?.itemName || '',
      description: editingItem?.description || '',
      categoryId: editingItem?.categoryId || '',
      price: editingItem?.price || '',
      discountPrice: editingItem?.discountPrice || '',
      availabilityTime: editingItem?.availabilityTime || 'All Day',
      dietaryInfo: editingItem?.dietaryInfo || 'Vegetarian',
      tasteInfo: editingItem?.tasteInfo || 'Mild',
      nutritionalInfo: editingItem?.nutritionalInfo || '',
    },
    validationSchema: menuSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          restaurantId,
          ...values,
          price: parseFloat(values.price),
          discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : null,
          categoryId: parseInt(values.categoryId),
          isOutOfStock: false,
        };

        let savedItemId;
        if (editingItem) {
          await updateMenuItem(editingItem.menuItemId, payload);
          savedItemId = editingItem.menuItemId;
          toast.success('Menu item updated!');
        } else {
          const res = await createMenuItem(payload);
          savedItemId = res.data.menuItemId;
          toast.success('Menu item added!');
        }

        if (selectedFiles.length > 0) {
          await uploadMenuImages(savedItemId, selectedFiles);
          toast.success('Images uploaded successfully');
        }

        setEditingItem(null);
        setSelectedFiles([]);
        resetForm();
        loadData();
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to save menu item');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted');
      loadData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (orderId, newStatus, order) => {
    try {
      await updateOrder(orderId, {
        userId: order.userId,
        restaurantId: order.restaurantId,
        shippingAddressId: order.shippingAddressId,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: newStatus,
      });
      toast.success('Order status updated');
      loadData();
    } catch {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (!restaurantId) {
    return (
      <div className="dashboard-page">
        <div className="no-restaurant">
          <h2>No Restaurant Found</h2>
          <p>You don't have a restaurant account linked to your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Restaurant Dashboard</h1>
            <p className="dashboard-subtitle">Manage your menu and orders</p>
          </div>
          <div className="dashboard-stats">
            <div className="dash-stat"><span>{menuItems.length}</span><small>Menu Items</small></div>
            <div className="dash-stat"><span>{orders.length}</span><small>Total Orders</small></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {[
            { key: 'menu', label: 'Menu Management' },
            { key: 'add', label: editingItem ? 'Edit Item' : 'Add Item' },
            { key: 'orders', label: 'Orders' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`dash-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); if (tab.key !== 'add') { setEditingItem(null); setSelectedFiles([]); } }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Menu List Tab */}
        {activeTab === 'menu' && (
          <div className="menu-management">
            {menuItems.length === 0 ? (
              <div className="empty-state-dash">
                <span>No Items</span>
                <p>No menu items yet. Add your first item!</p>
                <button className="add-item-btn" onClick={() => setActiveTab('add')}>+ Add Menu Item</button>
              </div>
            ) : (
              <div className="menu-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Dietary</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item.menuItemId}>
                        <td>{item.itemName}</td>
                        <td>{categories.find(c => c.categoryId === item.categoryId)?.categoryName || '-'}</td>
                        <td>₹{item.price}</td>
                        <td>{item.discountPrice ? `₹${item.discountPrice}` : '-'}</td>
                        <td><span className={`diet-chip ${item.dietaryInfo?.includes('Veg') ? 'veg' : 'nonveg'}`}>{item.dietaryInfo}</span></td>
                        <td>{item.availabilityTime}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              className="edit-btn"
                              onClick={() => { setEditingItem(item); setActiveTab('add'); }}
                            >Edit</button>
                            <button className="del-btn" onClick={() => handleDelete(item.menuItemId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Menu Tab */}
        {activeTab === 'add' && (
          <div className="add-menu-panel">
            <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={formik.handleSubmit} className="menu-form" noValidate>
              <div className="form-grid-2">
                <div className="field-group">
                  <label>Item Name *</label>
                  <input name="itemName" className={`dash-input ${formik.touched.itemName && formik.errors.itemName ? 'err' : ''}`}
                    placeholder="e.g. Spicy Chicken Burger"
                    value={formik.values.itemName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {formik.touched.itemName && formik.errors.itemName && <span className="err-txt">{formik.errors.itemName}</span>}
                </div>
                <div className="field-group">
                  <label>Category *</label>
                  <select name="categoryId" className={`dash-input ${formik.touched.categoryId && formik.errors.categoryId ? 'err' : ''}`}
                    value={formik.values.categoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                  {formik.touched.categoryId && formik.errors.categoryId && <span className="err-txt">{formik.errors.categoryId}</span>}
                </div>
              </div>

              <div className="field-group">
                <label>Description & Ingredients (50-250 chars) *</label>
                <textarea name="description" className={`dash-input dash-textarea ${formik.touched.description && formik.errors.description ? 'err' : ''}`}
                  placeholder="Describe the dish with key ingredients..."
                  value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} rows={3} />
                {formik.touched.description && formik.errors.description && <span className="err-txt">{formik.errors.description}</span>}
                <small style={{ color: 'var(--text-light)' }}>{formik.values.description.length}/250</small>
              </div>

              <div className="field-group" style={{ marginBottom: '15px' }}>
                <label>Images (Max 5)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="dash-input"
                  disabled={selectedFiles.length >= 5}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeFile(idx)}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >×</button>
                    </div>
                  ))}
                  {selectedFiles.length === 0 && editingItem?.images && editingItem.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img 
                        src={`http://localhost:8080${img.imageUrl}`} 
                        alt="existing" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', opacity: 0.7 }} 
                      />
                    </div>
                  ))}
                </div>
                {editingItem?.images?.length > 0 && selectedFiles.length === 0 && (
                  <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '5px' }}>
                    Uploading new images will replace all existing images.
                  </small>
                )}
              </div>

              <div className="form-grid-3">
                <div className="field-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" step="0.01" className={`dash-input ${formik.touched.price && formik.errors.price ? 'err' : ''}`}
                    placeholder="0.00" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {formik.touched.price && formik.errors.price && <span className="err-txt">{formik.errors.price}</span>}
                </div>
                <div className="field-group">
                  <label>Discount Price (₹)</label>
                  <input name="discountPrice" type="number" step="0.01" className="dash-input"
                    placeholder="Optional" value={formik.values.discountPrice} onChange={formik.handleChange} />
                </div>
                <div className="field-group">
                  <label>Nutritional Info</label>
                  <input name="nutritionalInfo" className="dash-input"
                    placeholder="e.g. 450 kcal, 20g protein" value={formik.values.nutritionalInfo} onChange={formik.handleChange} />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="field-group">
                  <label>Availability *</label>
                  <select name="availabilityTime" className="dash-input" value={formik.values.availabilityTime} onChange={formik.handleChange}>
                    <option>All Day</option>
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>10:00-22:00</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Dietary Info *</label>
                  <select name="dietaryInfo" className="dash-input" value={formik.values.dietaryInfo} onChange={formik.handleChange}>
                    <option>Vegetarian</option>
                    <option>Non-Vegetarian</option>
                    <option>Vegan</option>
                    <option>Pescatarian</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Taste Info *</label>
                  <select name="tasteInfo" className="dash-input" value={formik.values.tasteInfo} onChange={formik.handleChange}>
                    <option>Mild</option>
                    <option>Spicy</option>
                    <option>Sweet</option>
                    <option>Savory</option>
                    <option>Fresh</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
                {editingItem && (
                  <button type="button" className="cancel-btn" onClick={() => { setEditingItem(null); formik.resetForm(); setActiveTab('menu'); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-panel">
            {orders.length === 0 ? (
              <div className="empty-state-dash"><span>No Orders</span><p>No orders yet.</p></div>
            ) : (
              <div className="menu-table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User ID</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Current Status</th>
                      <th>Update Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>#{order.orderId}</td>
                        <td>User #{order.userId}</td>
                        <td>₹{order.totalAmount?.toFixed(2)}</td>
                        <td>{order.paymentMethod?.replace('_', ' ')}</td>
                        <td><span className="status-chip">{order.orderStatus}</span></td>
                        <td>
                          <select
                            className="status-select"
                            value={order.orderStatus}
                            onChange={e => handleStatusChange(order.orderId, e.target.value, order)}
                          >
                            {['Pending', 'Processing', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>{formatDateIST(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;
