import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import BrandList from '../pages/BrandList';

const BrandRoutes = () => {
  return (
    <Routes>
      <Route index element={<BrandList />} />
      <Route path="list" element={<BrandList />} />
      <Route path="*" element={<Navigate to="/products/brands" replace />} />
    </Routes>
  );
};

export default BrandRoutes;
