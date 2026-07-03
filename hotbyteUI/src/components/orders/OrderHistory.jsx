import React, { useState } from 'react';
import OrderCard from './OrderCard';
import './OrderHistory.css';

const OrderHistory = ({ orders }) => {
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h2 className="history-title">My Orders</h2>
        <div className="order-filters">
          {['All', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="no-orders">
            <p>No orders found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
