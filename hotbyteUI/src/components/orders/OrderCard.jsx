import React from 'react';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'dispatched': return 'status-dispatched';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-id">
          Order #{order.id}
          <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div className={`order-status ${getStatusColor(order.status)}`}>
          {order.status}
        </div>
      </div>
      
      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item-row">
            <span className="order-item-quantity">{item.quantity}x</span>
            <span className="order-item-name">{item.name}</span>
            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="order-footer">
        <div className="order-restaurant">
          From: <strong>{order.restaurantName}</strong>
        </div>
        <div className="order-total">
          Total: <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
