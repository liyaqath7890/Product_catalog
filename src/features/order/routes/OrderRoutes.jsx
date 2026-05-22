import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from '../pages/OrderList';

const OrderRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderList />} />
      {/* Detail view is handled by modal in this design, but we could add a dedicated page here if needed */}
    </Routes>
  );
};

export default OrderRoutes;
