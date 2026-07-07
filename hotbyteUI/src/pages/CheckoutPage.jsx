// CheckoutPage - Formik + Yup validated checkout form
// Places order via POST /api/orders/add after collecting shipping + payment details
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, addOrderItem } from '../api/orderApi';
import { addUserAddress, getAllUserAddresses } from '../api/userApi';
import { getAllMenuItems } from '../api/menuApi';
import './CheckoutPage.css';

// Yup validation schema
const checkoutSchema = Yup.object({
  selectedAddressId: Yup.string(),
  addressLine1: Yup.string().when('selectedAddressId', {
    is: 'new',
    then: (schema) => schema.required('Address is required'),
  }),
  city: Yup.string().when('selectedAddressId', {
    is: 'new',
    then: (schema) => schema.required('City is required'),
  }),
  state: Yup.string().when('selectedAddressId', {
    is: 'new',
    then: (schema) => schema.required('State is required'),
  }),
  zipCode: Yup.string().when('selectedAddressId', {
    is: 'new',
    then: (schema) => schema
      .matches(/^[0-9]{6}$/, 'Zip code must be 6 digits')
      .required('Zip code is required'),
  }),
  paymentMethod: Yup.string().required('Please select a payment method'),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: (schema) => schema
      .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
      .required('Card number is required'),
  }),
  cardExpiry: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: (schema) => schema
      .matches(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Format: MM/YY')
      .required('Expiry date is required'),
  }),
  cardCvv: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: (schema) => schema
      .matches(/^[0-9]{3,4}$/, 'CVV must be 3-4 digits')
      .required('CVV is required'),
  }),
});

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, cartId } = useCart();
  const navigate = useNavigate();
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [menuItems, setMenuItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, addressRes] = await Promise.all([
          getAllMenuItems(),
          getAllUserAddresses()
        ]);
        setMenuItems(menuRes.data);
        
        // Filter addresses for current user
        if (addressRes.data) {
           const myAddresses = addressRes.data.filter(a => a.userId === user?.userId);
           setSavedAddresses(myAddresses);
        }
      } catch (err) {
        console.error("Failed to load checkout data", err);
      } finally {
        setDataLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const getMenuItem = (id) => menuItems.find(m => m.menuItemId === id);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const menuItem = getMenuItem(item.menuItemId);
      const itemPrice = item.unitPrice || (menuItem ? (menuItem.discountPrice || menuItem.price) : 0);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const activeSubtotal = calculateSubtotal();
  const deliveryFee = activeSubtotal >= 500 ? 0 : (activeSubtotal > 0 ? 40 : 0);
  const grandTotal = activeSubtotal + deliveryFee;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selectedAddressId: savedAddresses.length > 0 ? savedAddresses[0].addressId.toString() : 'new',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      paymentMethod: 'CASH_ON_DELIVERY',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let addressId = null;

        // Step 1: Use existing or create new address
        if (values.selectedAddressId === 'new') {
          const addressPayload = {
            userId: user.userId,
            addressLine1: values.addressLine1,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            isDefault: true,
          };
          const addressRes = await addUserAddress(addressPayload);
          addressId = addressRes.data.addressId;
        } else {
          addressId = parseInt(values.selectedAddressId);
        }

        // Step 2: Determine restaurant ID from first cart item
        const firstMenuItem = getMenuItem(cartItems[0]?.menuItemId);
        if (!firstMenuItem) {
          throw new Error("Could not determine restaurant. Invalid cart items.");
        }
        const restaurantId = firstMenuItem.restaurantId;

        // Step 3: Create order
        const orderPayload = {
          userId: user.userId,
          restaurantId,
          shippingAddressId: addressId,
          totalAmount: grandTotal,
          paymentMethod: values.paymentMethod,
          estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        };
        const orderRes = await createOrder(orderPayload);
        const newOrderId = orderRes.data.orderId;

        // Step 4: Create order items
        await Promise.all(cartItems.map(async (item) => {
          const menuItem = getMenuItem(item.menuItemId);
          const itemPrice = item.unitPrice || (menuItem ? (menuItem.discountPrice || menuItem.price) : 0);
          const orderItemPayload = {
            orderId: newOrderId,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            purchasedPrice: itemPrice
          };
          await addOrderItem(orderItemPayload);
        }));

        setOrderId(newOrderId);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Failed to place order. Please try again.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (dataLoading) {
    return (
      <div className="checkout-page">
        <div className="loading-text" style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666'}}>
          Preparing checkout...
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">Success</div>
          <h2>Order Placed Successfully!</h2>
          <p>Order #{orderId} has been confirmed.</p>
          <p>Estimated delivery: <strong>30-45 minutes</strong></p>
          <div className="success-actions">
            <button onClick={() => navigate('/orders')} className="view-orders-btn">
              View My Orders
            </button>
            <button onClick={() => navigate('/menu')} className="continue-btn">
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="checkout-form" noValidate>

            {/* Shipping Address */}
            <div className="form-section">
              <h3 className="form-section-title">Delivery Address</h3>
              
              {savedAddresses.length > 0 && (
                <div className="saved-addresses">
                  {savedAddresses.map(address => (
                    <label key={address.addressId} className={`address-option ${formik.values.selectedAddressId === address.addressId.toString() ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="selectedAddressId"
                        value={address.addressId.toString()}
                        checked={formik.values.selectedAddressId === address.addressId.toString()}
                        onChange={formik.handleChange}
                      />
                      <div className="address-details">
                        <p>{address.addressLine1}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                      </div>
                    </label>
                  ))}
                  
                  <label className={`address-option ${formik.values.selectedAddressId === 'new' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="selectedAddressId"
                      value="new"
                      checked={formik.values.selectedAddressId === 'new'}
                      onChange={formik.handleChange}
                    />
                    <div className="address-details">
                      <p style={{fontWeight: 'bold'}}>+ Add New Address</p>
                    </div>
                  </label>
                </div>
              )}

              {formik.values.selectedAddressId === 'new' && (
                <div className="new-address-form" style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                  <div className="field-group">
                    <label>Address</label>
                    <input
                      name="addressLine1"
                      className={`checkout-input ${formik.touched.addressLine1 && formik.errors.addressLine1 ? 'input-err' : ''}`}
                      placeholder="Street address, apartment, etc."
                      value={formik.values.addressLine1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.addressLine1 && formik.errors.addressLine1 &&
                      <span className="err-msg">{formik.errors.addressLine1}</span>}
                  </div>

                  <div className="form-row-3">
                    <div className="field-group">
                      <label>City</label>
                      <input
                        name="city"
                        className={`checkout-input ${formik.touched.city && formik.errors.city ? 'input-err' : ''}`}
                        placeholder="City"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.city && formik.errors.city &&
                        <span className="err-msg">{formik.errors.city}</span>}
                    </div>
                    <div className="field-group">
                      <label>State</label>
                      <input
                        name="state"
                        className={`checkout-input ${formik.touched.state && formik.errors.state ? 'input-err' : ''}`}
                        placeholder="State"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.state && formik.errors.state &&
                        <span className="err-msg">{formik.errors.state}</span>}
                    </div>
                    <div className="field-group">
                      <label>Zip Code</label>
                      <input
                        name="zipCode"
                        className={`checkout-input ${formik.touched.zipCode && formik.errors.zipCode ? 'input-err' : ''}`}
                        placeholder="6-digit zip"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.zipCode && formik.errors.zipCode &&
                        <span className="err-msg">{formik.errors.zipCode}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="form-section">
              <h3 className="form-section-title">Payment Method</h3>
              <div className="payment-options">
                {[
                  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
                  { value: 'CREDIT_CARD', label: 'Credit / Debit Card' },
                  { value: 'UPI', label: 'UPI' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`payment-option ${formik.values.paymentMethod === opt.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={formik.values.paymentMethod === opt.value}
                      onChange={formik.handleChange}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              {formik.values.paymentMethod === 'CREDIT_CARD' && (
                <div className="card-fields">
                  <div className="field-group">
                    <label>Card Number</label>
                    <input
                      name="cardNumber"
                      className={`checkout-input ${formik.touched.cardNumber && formik.errors.cardNumber ? 'input-err' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      value={formik.values.cardNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber &&
                      <span className="err-msg">{formik.errors.cardNumber}</span>}
                  </div>
                  <div className="card-row">
                    <div className="field-group">
                      <label>Expiry (MM/YY)</label>
                      <input
                        name="cardExpiry"
                        className={`checkout-input ${formik.touched.cardExpiry && formik.errors.cardExpiry ? 'input-err' : ''}`}
                        placeholder="MM/YY"
                        maxLength={5}
                        value={formik.values.cardExpiry}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.cardExpiry && formik.errors.cardExpiry &&
                        <span className="err-msg">{formik.errors.cardExpiry}</span>}
                    </div>
                    <div className="field-group">
                      <label>CVV</label>
                      <input
                        name="cardCvv"
                        type="password"
                        className={`checkout-input ${formik.touched.cardCvv && formik.errors.cardCvv ? 'input-err' : ''}`}
                        placeholder="***"
                        maxLength={4}
                        value={formik.values.cardCvv}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.cardCvv && formik.errors.cardCvv &&
                        <span className="err-msg">{formik.errors.cardCvv}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="place-order-btn" disabled={formik.isSubmitting || cartItems.length === 0}>
              {formik.isSubmitting ? 'Placing Order...' : `Place Order - ₹${grandTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => {
              const menuItem = getMenuItem(item.menuItemId);
              const itemPrice = item.unitPrice || (menuItem ? (menuItem.discountPrice || menuItem.price) : 0);
              return (
              <div key={item.cartItemId} className="summary-item">
                <span>{item.quantity}x {menuItem ? menuItem.itemName : `Item #${item.menuItemId}`}</span>
                <span>₹{(itemPrice * item.quantity).toFixed(2)}</span>
              </div>
            )})}
            <div className="summary-sep" />
            <div className="summary-row"><span>Subtotal</span><span>₹{activeSubtotal.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>Free</span> : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="summary-sep" />
            <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
