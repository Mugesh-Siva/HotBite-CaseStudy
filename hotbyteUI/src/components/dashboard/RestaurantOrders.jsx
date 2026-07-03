import React from 'react';
import './RestaurantOrders.css';

const RestaurantOrders = ({ orders, onUpdateStatus }) => {
  const statusOptions = ['Processing', 'Dispatched', 'Delivered', 'Cancelled'];

  return (
    <div className="restaurant-orders-container">
      <h2 className="dashboard-title">Active Orders</h2>
      
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <div className="order-items-mini">
                      {order.items.map((item, idx) => (
                        <span key={idx}>{item.quantity}x {item.name}{idx < order.items.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No active orders at the moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantOrders;
