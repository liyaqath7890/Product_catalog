import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import AuthRoutes from '../authentication/routes/AuthRoutes';
import ProtectedRoute from '../authentication/components/ProtectedRoute';
import PublicRoute from '../authentication/components/PublicRoute';
import ProductRoutes from '../features/product/routes/ProductRoutes';
import CategoryRoutes from '../features/category/routes/CategoryRoutes';
import InventoryRoutes from '../features/inventory/routes/InventoryRoutes';
import OrderRoutes from '../features/order/routes/OrderRoutes';
import CustomerRoutes from '../features/customer/routes/CustomerRoutes';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthRoutes />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products/*" element={<ProductRoutes />} />
          <Route path="categories/*" element={<CategoryRoutes />} />
          <Route path="inventory/*" element={<InventoryRoutes />} />
          <Route path="orders/*" element={<OrderRoutes />} />
          <Route path="customers/*" element={<CustomerRoutes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
