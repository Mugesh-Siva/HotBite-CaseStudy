// AdminDashboardPage - Admin navigation hub
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage the entire HotByte platform</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="admin-grid" style={{ marginTop: '30px' }}>
          <div className="admin-stat-card" onClick={() => navigate('/admin/restaurants')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <span className="stat-label" style={{ fontSize: '24px', fontWeight: 'bold' }}>Restaurants</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Manage restaurants and vendors</p>
          </div>

          <div className="admin-stat-card" onClick={() => navigate('/admin/menus')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <span className="stat-label" style={{ fontSize: '24px', fontWeight: 'bold' }}>Menus</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Manage menu items and categories</p>
          </div>

          <div className="admin-stat-card" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <span className="stat-label" style={{ fontSize: '24px', fontWeight: 'bold' }}>Users</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>View and manage platform users</p>
          </div>

          <div className="admin-stat-card" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <span className="stat-label" style={{ fontSize: '24px', fontWeight: 'bold' }}>Orders</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>View customer order history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
