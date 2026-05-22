import React, { useState } from 'react';
import { User, Store, Bell, Lock, Globe, Shield, CreditCard, Mail, Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import CustomButton from '../components/custom/CustomButton';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Store', icon: Store },
    { id: 'Notifications', icon: Bell },
    { id: 'Security', icon: Shield },
    { id: 'Billing', icon: CreditCard }
  ];

  const handleSave = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">System Settings</h1>
        </div>
        <div className="flex items-center gap-3">
           {showSavedMsg && (
             <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <CheckCircle2 size={18} /> Changes Saved
             </div>
           )}
           <CustomButton onClick={handleSave} className="px-8 shadow-indigo-100 shadow-2xl py-3 rounded-2xl bg-gray-900 border-none">
              <Save size={18} className="mr-2" /> Save Config
           </CustomButton>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-white rounded-3xl p-3 border border-gray-100 shadow-sm flex lg:flex-col gap-1 overflow-x-auto no-scrollbar shrink-0">
           {tabs.map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap ${
                 activeTab === tab.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
               }`}
             >
               <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-600' : 'text-gray-300'} />
               {tab.id}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8 w-full">
           
           {/* Profile Section */}
           {activeTab === 'Profile' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm ring-1 ring-black/[0.02]">
                   <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Personal Information</h3>
                   <div className="flex flex-col md:flex-row gap-10 items-start">
                      <div className="relative group">
                         <div className="w-32 h-32 rounded-3xl bg-gray-100 border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
                            <User size={48} className="text-gray-300" />
                         </div>
                         <button className="absolute -bottom-3 -right-3 p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform">
                            <ImageIcon size={16} />
                         </button>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                         <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                            <input type="text" defaultValue="Admin" className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-gray-900 outline-none" />
                         </div>
                         <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Store Name</label>
                            <input type="text" defaultValue="Catalog" className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-gray-900 outline-none" />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                               <input type="email" defaultValue="admin@catalog.com" className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-gray-900 outline-none pl-12" />
                               <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm ring-1 ring-black/[0.02]">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">Account Preferences</h3>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                         <div>
                            <p className="font-bold text-gray-900 tracking-tight">Public Profile</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Making your profile public allows customers to see your ID.</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                         <div>
                            <p className="font-bold text-gray-900 tracking-tight">Email Notifications</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Receive summaries of daily store activity.</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </label>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Placeholder for other tabs */}
           {activeTab !== 'Profile' && (
             <div className="bg-white rounded-3xl p-20 border border-gray-100 shadow-sm ring-1 ring-black/[0.02] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                   <Lock size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{activeTab} Details</h3>
                <p className="text-sm font-bold text-gray-400 mt-2 max-w-xs uppercase tracking-widest leading-loose">Configure your global {activeTab.toLowerCase()} parameters currently in secure mode.</p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
