import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Download, ShoppingCart, User, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import OrderDetailModal from '../../../components/custom/OrderDetailModal';
import CreateOrderModal from '../../../components/custom/CreateOrderModal';
import { useOrderContext } from '../../../context/OrderContext';

const StatusBadge = ({ status }) => {
  const styles = {
    'Completed': 'bg-emerald-50 text-emerald-600',
    'Processing': 'bg-indigo-50 text-indigo-600',
    'Shipped': 'bg-blue-50 text-blue-600',
    'Pending': 'bg-amber-50 text-amber-600',
    'Cancelled': 'bg-rose-50 text-rose-600'
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const OrderList = () => {
  const { orders } = useOrderContext();
  const [selectedTab, setSelectedTab] = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['All Orders', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesTab = selectedTab === 'All Orders' || order.status === selectedTab;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  const handleExportOrders = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.date,
      order.total,
      order.payment,
      order.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Order Management</h1>
        </div>
        <div className="flex items-center gap-3">
           <CustomButton type="button" variant="outline" onClick={handleExportOrders} className="px-6 font-bold shadow-sm">
              <Download size={18} className="mr-2" /> Export
           </CustomButton>
           <CustomButton onClick={() => setIsCreateModalOpen(true)} className="px-8 shadow-indigo-100 shadow-2xl py-3 rounded-2xl bg-gray-900 border-none">
              <ShoppingCart size={20} className="mr-2" /> Create Order
           </CustomButton>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden ring-1 ring-black/[0.02]">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
          <div className="flex p-1.5 bg-gray-50 rounded-2xl w-max overflow-x-auto custom-scrollbar no-scrollbar">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`whitespace-nowrap px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                    selectedTab === tab ? 'bg-white shadow-xl shadow-gray-200 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all w-full lg:w-80 group">
               <Search size={18} className="text-gray-300 group-focus-within:text-indigo-500 transition-colors mr-3" />
               <input 
                 type="text" 
                 placeholder="Search orders..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent border-none outline-none text-sm w-full font-bold text-gray-700 placeholder:text-gray-300" 
               />
            </div>
            <CustomButton variant="outline" className="text-gray-500 border-gray-100 font-black uppercase tracking-widest text-[10px] px-4 py-3 rounded-2xl">
              <Filter size={18} className="mr-2" /> Filters
            </CustomButton>
          </div>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5">Payment</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(order)}
                  >
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">#{order.id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 tracking-tight">{order.customer}</div>
                          <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase">
                         <Calendar size={14} /> {order.date}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-900 font-black text-base">₹{order.total.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                         <CreditCard size={14} /> {order.payment}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-gray-300 hover:text-gray-900 p-2 rounded-xl transition-all hover:bg-white border border-transparent hover:border-gray-100 group-hover:bg-white shadow-sm shadow-transparent hover:shadow-gray-100">
                         <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
           <span>Showing {filteredOrders.length} orders</span>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-indigo-600 transition-all font-black">Prev</button>
              <button className="px-4 py-2 bg-white rounded-xl border border-gray-100 text-gray-900 hover:text-indigo-600 transition-all font-black">Next</button>
           </div>
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        order={selectedOrder}
      />

      <CreateOrderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default OrderList;
