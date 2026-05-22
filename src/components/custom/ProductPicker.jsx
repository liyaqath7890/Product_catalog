import React, { useState } from 'react';
import { Search, Filter, Box, Layers, Edit3, ArrowRight } from 'lucide-react';
import CustomButton from './CustomButton';
import { useProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import ProductFormModal from '../../features/product/components/ProductFormModal';

const ProductPicker = ({ mode = 'edit' }) => {
    const navigate = useNavigate();
    const { products, updateProduct } = useProductContext();
    const [search, setSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

    const handleAction = (product) => {
        if (mode === 'variants') {
            navigate(`/products/variants/${product.id}`);
        } else {
            setEditProduct(product);
            setIsEditModalOpen(true);
        }
    };

    const handleSave = (updated) => {
        updateProduct(updated);
        setIsEditModalOpen(false);
        setEditProduct(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        {mode === 'variants' ? 'Select Product for Variants' : 'Select Product to Edit'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Choose a catalog product to edit or prepare for advanced merchandising.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex items-center bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl focus-within:bg-white focus-within:border-indigo-500 transition-all flex-1 group">
                    <Search size={18} className="text-gray-300 group-focus-within:text-indigo-500 transition-colors mr-3" />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or SKU..." 
                        className="bg-transparent border-none outline-none text-sm font-bold w-full text-gray-700" 
                    />
                </div>
                <CustomButton variant="outline" className="px-5 py-3 rounded-2xl"><Filter size={18} /></CustomButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => (
                    <div key={product.id} onClick={() => handleAction(product)} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer ring-1 ring-black/[0.01]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                                <img src={product.image} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest uppercase mt-0.5">{product.sku}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</span>
                                <span className="text-sm font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                {mode === 'variants' ? <Layers size={16} /> : <Edit3 size={16} />}
                                <span className="hidden sm:inline">{mode === 'variants' ? 'Variants' : 'Edit'}</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ProductFormModal 
                isOpen={isEditModalOpen} 
                product={editProduct} 
                mode="edit"
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default ProductPicker;
