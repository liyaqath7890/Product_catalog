import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerList from '../pages/CustomerList';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route index element={<CustomerList />} />
    </Routes>
  );
};

export default CustomerRoutes;
