import React from 'react';
import { X, FileText, Download, TrendingUp, Users, Package, ShoppingCart, Percent } from 'lucide-react';
import CustomButton from './CustomButton';
import { useProductContext } from '../../context/ProductContext';
import { useOrderContext } from '../../context/OrderContext';
import { useCustomerContext } from '../../context/CustomerContext';

const ReportModal = ({ isOpen, onClose }) => {
    const { products } = useProductContext();
    const { orders } = useOrderContext();
    const { customers } = useCustomerContext();

    if (!isOpen) return null;

    const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.qty || 0)), 0);
    const lowStockCount = products.filter(p => (p.qty || 0) < 5).length;
    const totalOrdersValue = orders.reduce((acc, o) => acc + o.total, 0);
    const vipCustomers = customers.filter(c => c.status.includes('VIP')).length;

    const handleDownload = () => {
        alert("Downloading Catalog Business Report (PDF)...");
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Business Intelligence Report</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-0.5">Automated Store Performance Analytics</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-gray-50/30">
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Revenue', value: `₹${totalOrdersValue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Asset Value', value: `₹${totalStockValue.toLocaleString()}`, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Conversion', value: '3.4%', icon: Percent, color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Inventory Health */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                                <Package size={20} className="text-gray-400" />
                                Inventory Health
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 mb-1">Stock Availability</p>
                                        <h5 className="text-3xl font-black text-gray-900">92%</h5>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{lowStockCount} Items Low Stock</p>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                    <div className="h-full bg-amber-400" style={{ width: '10%' }}></div>
                                    <div className="h-full bg-rose-500" style={{ width: '5%' }}></div>
                                </div>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                                    Your inventory is currently healthy with high availability in key electronics categories. Consider restocking items with low quantities.
                                </p>
                            </div>
                        </div>

                        {/* Customer Loyalty */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                                <Users size={20} className="text-gray-400" />
                                Customer Insights
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">VIP Base</p>
                                        <h5 className="text-2xl font-black text-indigo-700">{vipCustomers}</h5>
                                    </div>
                                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Growth</p>
                                        <h5 className="text-2xl font-black text-emerald-700">+12%</h5>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed">
                                    Customer retention is rising. VIP members contribute to 65% of total revenue. Campaign "Spring Gadget Sale" is driving new signups.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order History Preview */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-black text-gray-900 text-lg mb-6">Recent Sales Activity</h3>
                        <div className="space-y-4">
                            {orders.slice(0, 3).map(order => (
                                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <ShoppingCart size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 tracking-tight">#{order.id}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{order.customer}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-emerald-600">₹{order.total.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{order.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-8 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <p className="text-xs font-bold text-gray-400 italic">Report generated on {new Date().toLocaleString()}</p>
                    <div className="flex gap-4">
                        <CustomButton variant="outline" onClick={onClose} className="px-8">Close</CustomButton>
                        <CustomButton onClick={handleDownload} className="px-10 bg-gray-900 text-white shadow-2xl shadow-indigo-100 border-none">
                            <Download size={20} className="mr-2" />
                            Download PDF
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
