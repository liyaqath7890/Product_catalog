import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CategoryList from '../pages/CategoryList';
import CategoryDetail from '../pages/CategoryDetail';
import CreateEditCategory from '../pages/CreateEditCategory';
import CategoryPicker from '../components/CategoryPicker';
import SubCategoryRoutes from '../../subCategory/routes/SubCategoryRoutes';

const CategoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<CategoryList />} />
      <Route path="list" element={<CategoryList />} />
      <Route path="details/:id" element={<CategoryDetail />} />
      <Route path="details" element={<Navigate to="/categories/list" replace />} />
      <Route path="create" element={<CategoryList />} />
      <Route path="subcategories/*" element={<SubCategoryRoutes />} />
      <Route path="edit/:id" element={<CreateEditCategory />} />
      <Route path="edit" element={<CategoryPicker />} />
      <Route path="*" element={<Navigate to="/categories" replace />} />
    </Routes>
  );
};

export default CategoryRoutes;
