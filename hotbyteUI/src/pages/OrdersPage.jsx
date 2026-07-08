// OrdersPage - User's order history with live status updates (polls every 15s)
import React, { useEffect, useState, useCallback } from 'react';
import { getAllOrders, getAllOrderItems } from '../api/orderApi';
import { getAllMenuItems } from '../api/menuApi';
import { getAllRestaurants } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

// Status badge colours
const STATUS_COLORS = {
  'Pending':    { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  'Processing': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  'Preparing':  { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
  'In Transit': { bg: '#ecfeff', color: '#0e7490', border: '#a5f3fc' },
  'Delivered':  { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  'Cancelled':  { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
};

// Delivery tracker steps
const TRACKER_STEPS = ['Pending', 'Preparing', 'In Transit', 'Delivered'];

/**
 * Safely parse a date from various Spring Boot formats:
 *  - ISO string:    "2025-07-07T10:30:00"
 *  - Array format:  [2025, 7, 7, 10, 30, 0]  (legacy / no Jackson config)
 *  - null / undefined → returns null
 */
const parseDate = (raw) => {
  if (!raw) return null;
  // Java LocalDateTime array: [year, month, day, hour, min, sec, nano]
  if (Array.isArray(raw)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = raw;
    // months in JS Date are 0-indexed
    return new Date(y, mo - 1, d, h, mi, s);
  }
  // ISO string or timestamp number
  const dt = new Date(raw);
  return isNaN(dt.getTime()) ? null : dt;
};

/**
 * Format date in Indian Standard Time with user-friendly display.
 */
const formatDateIST = (raw) => {
  const dt = parseDate(raw);
  if (!dt) return '—';
  return dt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatTimeIST = (raw) => {
  const dt = parseDate(raw);
  if (!dt) return '—';
  return dt.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ─────────────────────────────────────────────
const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders]         = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems]   = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [lastUpdated, setLastUpdated]   = useState(null);

  // ── Data fetcher (called on mount + every 15 s) ──────────────────────────
  const fetchData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const [ordersRes, orderItemsRes, menuRes, restRes] = await Promise.all([
        getAllOrders(),
        getAllOrderItems(),
        getAllMenuItems(),
        getAllRestaurants(),
      ]);

      const myOrders = (ordersRes.data || [])
        .filter(o => o.userId === user?.userId)
        .sort((a, b) => b.orderId - a.orderId);

      setOrders(myOrders);
      setOrderItems(orderItemsRes.data || []);
      setMenuItems(menuRes.data || []);
      setRestaurants(restRes.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load order data:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) fetchData(true);
  }, [user, fetchData]);

  // Live polling every 15 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchData(false), 15000);
    return () => clearInterval(interval);
  }, [user, fetchData]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const statuses     = ['All', 'Pending', 'Processing', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'];
  const getMenuItem  = (id) => menuItems.find(m => m.menuItemId === id);
  const getRestaurant = (id) => restaurants.find(r => r.restaurantId === id);

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(o => o.orderStatus === filterStatus);

  // ── Tracker step index ───────────────────────────────────────────────────
  const getTrackerIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return TRACKER_STEPS.indexOf(status);
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loader">
          <div className="loader-spinner" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">
              Track all your food orders in real-time
            </p>
          </div>
          <div className="orders-meta">
            {lastUpdated && (
              <span className="last-updated">
                Updated {lastUpdated.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <span className="order-count-badge">{orders.length} Order{orders.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* ── Status Filters ──────────────────────────────────────────── */}
        <div className="status-filters">
          {statuses.map(s => (
            <button
              key={s}
              className={`status-filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
              {s !== 'All' && (
                <span className="filter-count">
                  {orders.filter(o => o.orderStatus === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <h3>No orders found</h3>
            <p>
              {filterStatus === 'All'
                ? "You haven't placed any orders yet. Go explore our menu!"
                : `No orders with status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => {
              const statusStyle  = STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Pending'];
              const restaurant   = getRestaurant(order.restaurantId);
              const myItems      = orderItems.filter(oi => oi.orderId === order.orderId);
              const trackerIdx   = getTrackerIndex(order.orderStatus);
              const isCancelled  = order.orderStatus === 'Cancelled';

              return (
                <div key={order.orderId} className="order-card">

                  {/* ── Card header ───────────────────────── */}
                  <div className="order-card-header">
                    <div className="order-header-left">
                      <span className="order-id">Order #{order.orderId}</span>
                      {restaurant && (
                        <span className="order-restaurant">
                          {restaurant.name}
                        </span>
                      )}
                      <span className="order-date">
                        Date: {formatDateIST(order.createdAt)}
                      </span>
                    </div>
                    <span
                      className="order-status-badge"
                      style={{
                        background: statusStyle.bg,
                        color:      statusStyle.color,
                        border:     `1px solid ${statusStyle.border}`,
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* ── Card body ─────────────────────────── */}
                  <div className="order-card-body">

                    {/* Food items */}
                    {myItems.length > 0 && (
                      <div className="ordered-items-section">
                        <h4 className="section-label">Items Ordered</h4>
                        <div className="ordered-items-list">
                          {myItems.map(oi => {
                            const menuItem = getMenuItem(oi.menuItemId);
                            return (
                              <div key={oi.orderItemId} className="ordered-item-row">
                                <span className="item-qty">{oi.quantity}×</span>
                                <span className="item-name">
                                  {menuItem ? menuItem.itemName : `Item #${oi.menuItemId}`}
                                </span>
                                <span className="item-price">₹{Number(oi.purchasedPrice).toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order details grid */}
                    <div className="order-details-grid">
                      <div className="order-detail-cell">
                        <span className="detail-label">Payment</span>
                        <span className="detail-value">
                          {order.paymentMethod?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="order-detail-cell">
                        <span className="detail-label">Est. Delivery</span>
                        <span className="detail-value">
                          {formatTimeIST(order.estimatedDeliveryTime)}
                        </span>
                      </div>
                      <div className="order-detail-cell total-cell">
                        <span className="detail-label">Total Amount</span>
                        <span className="detail-value total-amount">
                          ₹{Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Delivery Progress Tracker ─────────── */}
                  {!isCancelled ? (
                    <div className="delivery-tracker">
                      <h4 className="section-label">Order Progress</h4>
                      <div className="tracker-steps">
                        {TRACKER_STEPS.map((step, idx) => {
                          const isCompleted = idx <= trackerIdx;
                          const isCurrent   = idx === trackerIdx;
                          return (
                            <React.Fragment key={step}>
                              <div className={`tracker-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="tracker-dot">
                                  {isCompleted && <span className="tracker-check">✓</span>}
                                </div>
                                <span className="tracker-label">{step}</span>
                              </div>
                              {idx < TRACKER_STEPS.length - 1 && (
                                <div className={`tracker-line ${idx < trackerIdx ? 'completed' : ''}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="cancelled-banner">
                      This order was cancelled
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
