import React, { useEffect, useState } from 'react';
import { X, User, Mail, Phone, MapPin, CheckCircle, Tag } from 'lucide-react';
import CustomButton from './CustomButton';
import { useCustomerContext } from '../../context/CustomerContext';

const getInitialFormData = (customer) => ({
    name: customer?.name ?? '',
    email: customer?.email ?? '',
    phone: customer?.phone ?? '',
    location: customer?.location ?? '',
    status: customer?.status ?? 'Active',
    segment: customer?.segment ?? 'Organic',
    notes: customer?.notes ?? '',
});

const CreateCustomerModal = ({ isOpen, onClose, customer = null }) => {
    const { addCustomer, updateCustomer } = useCustomerContext();
    const [formData, setFormData] = useState(() => getInitialFormData(customer));

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData(customer));
        }
    }, [customer, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (customer) {
            updateCustomer({ ...customer, ...formData });
        } else {
            addCustomer(formData);
        }

        onClose();
        setFormData(getInitialFormData(null));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">
                            {customer ? 'Edit Customer' : 'Add New Customer'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {customer
                                ? 'Update customer contact details, loyalty level, and notes.'
                                : 'Create a new customer profile with the same shared form.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form id="customer-form" onSubmit={handleSubmit} className="space-y-6 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Wick" 
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
                                    placeholder="customer@domain.com" 
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="City or region"
                                    className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Level</label>
                            <div className="flex gap-2">
                                {['Active', 'VIP', 'VIP Plus'].map(status => (
                                    <button 
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                                            formData.status === status 
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm' 
                                            : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Customer Source</label>
                            <div className="relative">
                                <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    value={formData.segment}
                                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                    placeholder="Organic, Referral, Walk-in..."
                                    className="w-full rounded-2xl border border-gray-200 py-3.5 pl-12 pr-4 font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Notes</label>
                        <textarea
                            rows="4"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Anything useful for the team to remember about this customer..."
                            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3.5 font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-end gap-4 border-t border-gray-100 bg-white px-8 py-5">
                    <CustomButton variant="outline" onClick={onClose} className="px-6">Cancel</CustomButton>
                    <CustomButton form="customer-form" type="submit" className="px-8 bg-gray-900 border-none">
                        <CheckCircle size={18} className="mr-2" />
                        {customer ? 'Save Changes' : 'Create Profile'}
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default CreateCustomerModal;
