import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getAllCategories, uploadMenuImages, deleteMenuImage } from '../../api/menuApi';
import { getAllRestaurants } from '../../api/restaurantApi';
import '../DashboardPage.css';

const AdminMenusPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    categoryId: '',
    itemName: '',
    description: '',
    price: '',
    discountPrice: '',
    availabilityTime: '',
    dietaryInfo: 'Vegetarian',
    tasteInfo: '',
    nutritionalInfo: '',
    isOutOfStock: false
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, restRes, catRes] = await Promise.all([
        getAllMenuItems(),
        getAllRestaurants(),
        getAllCategories()
      ]);
      setMenuItems(menuRes.data);
      setRestaurants(restRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Menu item deleted');
      loadData();
    } catch { 
      toast.error('Failed to delete menu item'); 
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.menuItemId);
      setFormData({
        restaurantId: item.restaurantId,
        categoryId: item.categoryId,
        itemName: item.itemName,
        description: item.description || '',
        price: item.price,
        discountPrice: item.discountPrice || '',
        availabilityTime: item.availabilityTime || '',
        dietaryInfo: item.dietaryInfo || 'Vegetarian',
        tasteInfo: item.tasteInfo || '',
        nutritionalInfo: item.nutritionalInfo || '',
        isOutOfStock: item.isOutOfStock || false
      });
      setExistingImages(item.images || []);
      setSelectedFiles([]);
    } else {
      setEditingId(null);
      setFormData({
        restaurantId: '',
        categoryId: '',
        itemName: '',
        description: '',
        price: '',
        discountPrice: '',
        availabilityTime: '',
        dietaryInfo: 'Vegetarian',
        tasteInfo: '',
        nutritionalInfo: '',
        isOutOfStock: false
      });
      setExistingImages([]);
      setSelectedFiles([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setSelectedFiles([]);
    setExistingImages([]);
  };

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

  const removeExistingImage = async (imageId, index) => {
    try {
      await deleteMenuImage(imageId);
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setExistingImages(newImages);
      toast.success('Image removed successfully');
      loadData(); // refresh table data in background
    } catch (err) {
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.restaurantId || !formData.categoryId || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (formData.description && (formData.description.length < 50 || formData.description.length > 250)) {
      toast.error('Description must be between 50 and 250 characters');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null
      };

      let savedItemId;
      if (editingId) {
        await updateMenuItem(editingId, payload);
        savedItemId = editingId;
        toast.success('Menu item updated successfully');
      } else {
        const res = await createMenuItem(payload);
        savedItemId = res.data.menuItemId;
        toast.success('Menu item created successfully');
      }

      // If there are new files to upload
      if (selectedFiles.length > 0) {
        await uploadMenuImages(savedItemId, selectedFiles);
        toast.success('Images uploaded successfully');
      }

      handleCloseModal();
      loadData();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      categories.find(c => c.categoryId === item.categoryId)?.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id) => categories.find(c => c.categoryId === id)?.categoryName || '';
  const getRestaurantName = (id) => restaurants.find(r => r.restaurantId === id)?.restaurantName || '';

  if (loading) return <div className="dashboard-loading">Loading menu items...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="dashboard-title">Manage Menus</h1>
            <p className="dashboard-subtitle">Add, edit, or remove menu items</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add Menu Item
          </button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: '200px', maxWidth: '400px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        <div className="menu-table-wrapper">
          <table className="dash-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Restaurant</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.menuItemId}>
                  <td>#{item.menuItemId}</td>
                  <td>{item.itemName}</td>
                  <td>{getCategoryName(item.categoryId)}</td>
                  <td>{getRestaurantName(item.restaurantId)}</td>
                  <td>₹{item.price}</td>
                  <td>{item.isOutOfStock ? 'Out of Stock' : 'Available'}</td>
                  <td>
                    <button 
                      onClick={() => handleOpenModal(item)}
                      style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="del-btn" 
                      onClick={() => handleDelete(item.menuItemId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No menu items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Item Name *</label>
                    <input 
                      type="text" 
                      value={formData.itemName}
                      onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Price (₹) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.1"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant *</label>
                    <select 
                      value={formData.restaurantId}
                      onChange={(e) => setFormData({...formData, restaurantId: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                      required
                    >
                      <option value="">Select Restaurant</option>
                      {restaurants.map(r => (
                        <option key={r.restaurantId} value={r.restaurantId}>{r.restaurantName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Category *</label>
                    <select 
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Description (50-250 chars) *</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', minHeight: '80px' }}
                    minLength={50}
                    maxLength={250}
                    required
                  />
                  <small style={{ color: 'var(--text-light)' }}>{formData.description.length}/250</small>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Images (Max 5)</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    disabled={selectedFiles.length >= 5}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {existingImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img 
                          src={`http://localhost:8080${img.imageUrl}`} 
                          alt="existing" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeExistingImage(img.imageId, idx)}
                          style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >×</button>
                      </div>
                    ))}
                    {selectedFiles.map((file, idx) => (
                      <div key={'new'+idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', opacity: 0.8 }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '5px' }}>
                    New images will be appended to existing ones.
                  </small>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Dietary Info</label>
                    <select 
                      value={formData.dietaryInfo}
                      onChange={(e) => setFormData({...formData, dietaryInfo: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Pescatarian">Pescatarian</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Discount Price (optional)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isOutOfStock}
                    onChange={(e) => setFormData({...formData, isOutOfStock: e.target.checked})}
                    id="isOutOfStockCheck"
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor="isOutOfStockCheck">Mark as Out of Stock</label>
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

export default AdminMenusPage;
