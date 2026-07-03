import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './AddMenuForm.css';

const AddMenuForm = ({ onAddMenu }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    availabilityTime: 'All Day',
    dietaryInfo: 'Veg',
    tasteInfo: 'Mild',
    calories: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMenu({
      ...formData,
      price: parseFloat(formData.price),
      calories: parseInt(formData.calories) || 0
    });
    // Reset form after submission
    setFormData({
      name: '', description: '', category: '', price: '',
      availabilityTime: 'All Day', dietaryInfo: 'Veg', tasteInfo: 'Mild',
      calories: '', imageUrl: ''
    });
  };

  return (
    <div className="add-menu-container">
      <h2 className="dashboard-title">Add New Menu Item</h2>
      <form onSubmit={handleSubmit} className="add-menu-form">
        
        <div className="form-grid">
          <InputField
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Spicy Chicken Burger"
            required
          />
          <InputField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Main Course, Burger"
            required
          />
        </div>

        <InputField
          label="Description & Ingredients"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the item and key ingredients..."
          required
        />

        <div className="form-grid three-cols">
          <InputField
            label="Price ($)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <InputField
            label="Calories"
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="e.g. 450"
          />
          <InputField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-grid three-cols">
          <div className="select-group">
            <label>Availability Time</label>
            <select name="availabilityTime" value={formData.availabilityTime} onChange={handleChange}>
              <option value="All Day">All Day</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div className="select-group">
            <label>Dietary Info</label>
            <select name="dietaryInfo" value={formData.dietaryInfo} onChange={handleChange}>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <div className="select-group">
            <label>Taste Info</label>
            <select name="tasteInfo" value={formData.tasteInfo} onChange={handleChange}>
              <option value="Mild">Mild</option>
              <option value="Spicy">Spicy</option>
              <option value="Sweet">Sweet</option>
              <option value="Savory">Savory</option>
            </select>
          </div>
        </div>

        <Button type="submit" variant="primary" className="submit-menu-btn">
          Add Menu Item
        </Button>
      </form>
    </div>
  );
};

export default AddMenuForm;
