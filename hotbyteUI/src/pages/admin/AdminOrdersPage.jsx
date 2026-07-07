import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders } from '../../api/orderApi';
import '../DashboardPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading orders...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">View Orders</h1>
            <p className="dashboard-subtitle">Historical records of all customer orders</p>
          </div>
        </div>

        <div className="menu-table-wrapper" style={{ marginTop: '30px' }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Restaurant ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>User #{o.userId}</td>
                  <td>Rest. #{o.restaurantId}</td>
                  <td>₹{o.totalAmount?.toFixed(2)}</td>
                  <td><span className="status-chip">{o.orderStatus}</span></td>
                  <td>{o.paymentMethod?.replace('_', ' ')}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
