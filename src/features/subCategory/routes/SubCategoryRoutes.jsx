import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SubcategoryList from '../pages/SubcategoryList';

const SubCategoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<SubcategoryList />} />
      <Route path="list" element={<SubcategoryList />} />
      <Route path="*" element={<Navigate to="/categories/subcategories" replace />} />
    </Routes>
  );
};

export default SubCategoryRoutes;
