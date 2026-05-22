import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProductList from '../pages/ProductList';
import CreateProduct from '../pages/CreateProduct';
import ProductPicker from '../components/ProductPicker';
import UnitList from '../pages/UnitList';
import BrandRoutes from '../../brand/routes/BrandRoutes';

const ProductRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProductList />} />
      <Route path="list" element={<ProductList />} />
      <Route path="create" element={<ProductList />} />
      <Route path="create-page" element={<CreateProduct />} />
      <Route path="variants/:productId" element={<ProductList />} />
      <Route path="variants" element={<ProductList />} />
      <Route path="brands/*" element={<BrandRoutes />} />
      <Route path="units" element={<UnitList />} />
      <Route path="edit/:productId" element={<ProductPicker mode="edit" />} />
      <Route path="edit" element={<ProductPicker mode="edit" />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
};

export default ProductRoutes;
