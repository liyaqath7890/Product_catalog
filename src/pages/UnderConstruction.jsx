import React from 'react';
import { Settings, ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/custom/CustomButton';

const UnderConstruction = ({ featureName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 shadow-xl shadow-indigo-100 ring-4 ring-white">
        <Construction size={48} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Module Under Calibration</h2>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-md leading-relaxed mb-10">
        The <span className="text-indigo-600 font-black">{featureName}</span> system is currently undergoing deep technical upgrades. 
        Please check back shortly for full access.
      </p>
      <div className="flex gap-4">
         <CustomButton variant="outline" onClick={() => navigate(-1)} className="px-8 py-3 rounded-2xl">
            <ArrowLeft size={18} className="mr-2" /> Previous View
         </CustomButton>
         <CustomButton onClick={() => navigate('/')} className="px-8 py-3 rounded-2xl bg-gray-900 border-none shadow-2xl shadow-indigo-100">
            Platform Dashboard
         </CustomButton>
      </div>
    </div>
  );
};

export default UnderConstruction;
