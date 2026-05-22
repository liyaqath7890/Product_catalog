import React from 'react';
import { X, Package, Truck, User, CreditCard, ChevronRight, Download, Printer, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import CustomButton from './CustomButton';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const timeline = [
    { label: 'Order Placed', time: '25 Mar, 2025 10:45 AM', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Payment Confirmed', time: '25 Mar, 2025 10:47 AM', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Processing at Warehouse', time: '25 Mar, 2025 02:15 PM', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shipped to Customer', time: 'Waiting', icon: Truck, color: 'text-gray-400', bg: 'bg-gray-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 shrink-0">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity outline-none" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <h3 className="text-lg font-black text-gray-900 tracking-tight">Order #{order.id}</h3>
             <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
               order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
               order.status === 'Processing' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
             }`}>
               {order.status}
             </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/20">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Order Items & Pricing */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Customer summary */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/60 shadow-sm flex flex-col sm:flex-row gap-8">
                <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-3 text-indigo-600 mb-2">
                      <User size={18} />
                      <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Customer Details</h4>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-lg font-black text-gray-900 tracking-tight">{order.customer}</h5>
                        <p className="text-sm font-bold text-gray-400">{order.email}</p>
                      </div>
                   </div>
                </div>
                <div className="flex-1 space-y-6 sm:border-l sm:border-gray-50 sm:pl-8">
                   <div className="flex items-center gap-3 text-indigo-600 mb-2">
                      <Truck size={18} />
                      <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Delivery Address</h4>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-600 leading-relaxed">
                        221B Baker Street, London<br />
                        United Kingdom, NW1 6XE<br />
                        Contact: +44 20 7234 3456
                      </p>
                   </div>
                </div>
              </div>

              {/* Items grid */}
              <div className="bg-white rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50">
                   <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Order Items</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { name: 'MacBook Pro 14"', price: 1999.00, qty: 1, sku: 'MBP-14-M3', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80' },
                    { name: 'Sony WH-1000XM5', price: 398.00, qty: 2, sku: 'SNY-WH-XM5', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=150&q=80' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-gray-50 p-2 rounded-2xl border border-gray-100/60 mix-blend-multiply flex-shrink-0 group-hover:scale-105 transition-transform">
                             <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                             <h6 className="font-black text-gray-900 tracking-tight">{item.name}</h6>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU: {item.sku}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-base font-black text-gray-900">${item.price.toLocaleString()}</p>
                          <p className="text-xs font-bold text-gray-400">Qty: {item.qty}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-gray-50 flex flex-col items-end gap-3 text-sm">
                   <div className="flex justify-between w-full max-w-[240px] text-gray-400 font-bold">
                      <span>Subtotal</span>
                      <span className="text-gray-900">$2,397.00</span>
                   </div>
                   <div className="flex justify-between w-full max-w-[240px] text-gray-400 font-bold">
                      <span>Shipping (Express)</span>
                      <span className="text-emerald-600">FREE</span>
                   </div>
                   <div className="flex justify-between w-full max-w-[240px] text-gray-400 font-bold">
                      <span>Tax (GST 18%)</span>
                      <span className="text-gray-900">$431.46</span>
                   </div>
                   <div className="flex justify-between w-full max-w-[240px] pt-4 mt-2 border-t border-gray-200 text-lg font-black text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-indigo-600">${order.total.toLocaleString()}</span>
                   </div>
                </div>
              </div>

            </div>

            {/* Right Column: Timeline & Meta */}
            <div className="space-y-8">
              
              {/* Payment Status */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/60 shadow-sm space-y-6">
                 <div className="flex items-center gap-3 text-indigo-600 mb-2">
                    <CreditCard size={18} />
                    <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Payment Summary</h4>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm font-bold text-xs uppercase">VISA</div>
                       <div>
                          <p className="text-xs font-bold text-gray-900 tracking-tight">{order.payment}</p>
                          <p className="text-[10px] font-bold text-gray-400">Ends with 4242</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Paid</span>
                 </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 text-indigo-600 mb-8 px-1">
                   <Clock size={18} />
                   <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Order Timeline</h4>
                </div>
                <div className="relative pl-6 space-y-10 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-8px)] before:w-[2px] before:bg-gray-100">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative group">
                       <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-lg ${step.bg} ${step.color} flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-110`}>
                          <step.icon size={12} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[13px] font-black text-gray-900 tracking-tight">{step.label}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{step.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-900 rounded-3xl p-8 shadow-xl shadow-indigo-100 flex flex-col gap-4">
                 <button className="w-full py-3.5 bg-white rounded-2xl text-sm font-black text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <Printer size={18} /> Print Invoice
                 </button>
                 <button className="w-full py-3.5 bg-indigo-600 rounded-2xl text-sm font-black text-white uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Download size={18} /> Download JSON
                 </button>
                 <button className="w-full py-3.5 bg-white/10 rounded-2xl text-sm font-black text-gray-400 uppercase tracking-widest hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2">
                    <Trash2 size={18} /> Cancel Order
                 </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;
