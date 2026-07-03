import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './CheckoutForm.css';

const CheckoutForm = ({ onPlaceOrder }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder(formData);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        
        <div className="checkout-section">
          <h3 className="section-title">Shipping Address</h3>
          <InputField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <InputField
            label="Delivery Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Apt 4B"
            required
          />
          <div className="form-row">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              required
            />
            <InputField
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="10001"
              required
            />
          </div>
        </div>

        <div className="checkout-section">
          <h3 className="section-title">Payment Details</h3>
          <InputField
            label="Card Number"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX XXXX"
            required
          />
          <div className="form-row">
            <InputField
              label="Expiry Date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              required
            />
            <InputField
              label="CVV"
              name="cvv"
              type="password"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              required
            />
          </div>
        </div>

        <Button type="submit" variant="primary" className="place-order-btn">
          Place Order
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
