import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InventoryDashboard from '../pages/InventoryDashboard';
import InboundOutbound from '../pages/InboundOutbound';
import StockPlanner from '../pages/StockPlanner';

const InventoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InventoryDashboard />} />
      <Route path="/inbound-outbound" element={<InboundOutbound />} />
      <Route path="/planner" element={<StockPlanner />} />
    </Routes>
  );
};

export default InventoryRoutes;
