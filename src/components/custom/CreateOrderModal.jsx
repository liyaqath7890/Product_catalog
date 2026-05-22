import React, { useState } from 'react';
import { X, User, Mail, DollarSign, CreditCard, ShoppingCart } from 'lucide-react';
import CustomButton from './CustomButton';
import { useOrderContext } from '../../context/OrderContext';

const CreateOrderModal = ({ isOpen, onClose }) => {
    const { addOrder } = useOrderContext();
    const [formData, setFormData] = useState({
        customer: '',
        email: '',
        total: '',
        status: 'Pending',
        payment: 'Credit Card'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        addOrder({
            ...formData,
            total: parseFloat(formData.total) || 0
        });
        onClose();
        setFormData({
            customer: '',
            email: '',
            total: '',
            status: 'Pending',
            payment: 'Credit Card'
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Create Manual Order</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form id="order-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Customer Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="text" 
                                    required
                                    value={formData.customer}
                                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                    placeholder="e.g. John Doe" 
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="customer@example.com" 
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Total Amount (₹)</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input 
                                        type="number" 
                                        required
                                        value={formData.total}
                                        onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                                        placeholder="0.00" 
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Payment Method</label>
                                <div className="relative">
                                    <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <select 
                                        value={formData.payment}
                                        onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium bg-white appearance-none"
                                    >
                                        <option>Credit Card</option>
                                        <option>PayPal</option>
                                        <option>Bank Transfer</option>
                                        <option>Crypto</option>
                                        <option>COD</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Order Status</label>
                            <div className="flex gap-2">
                                {['Pending', 'Processing', 'Shipped', 'Completed'].map(status => (
                                    <button 
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                                            formData.status === status 
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600' 
                                            : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0 bg-white">
                    <CustomButton variant="outline" onClick={onClose} className="px-6">Cancel</CustomButton>
                    <CustomButton form="order-form" type="submit" className="px-8 bg-gray-900">
                        <ShoppingCart size={18} className="mr-2" />
                        Create Order
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;
