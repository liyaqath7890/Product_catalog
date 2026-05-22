import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Edit3, Save, X, Cpu, Palette, ArrowLeft, Filter, ChevronDown, Settings2, Sparkles } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTable from '../../../components/custom/CustomTable';
import { useProductContext } from '../../../context/ProductContext';

const ManageVariants = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { products, updateProduct } = useProductContext();
    
    const product = products.find(p => p.id === parseInt(productId)) || products[0];
    const [variants, setVariants] = useState([]);
    const [options, setOptions] = useState([
        { id: 1, name: 'Color', values: ['Space Gray', 'Silver', 'Midnight Blue'] },
        { id: 2, name: 'RAM', values: ['8GB', '16GB', '32GB'] },
        { id: 3, name: 'Storage', values: ['256GB', '512GB', '1TB'] }
    ]);

    useEffect(() => {
        if (product && product.variants) {
            setVariants(product.variants);
        } else {
            setVariants([
                { id: 1, ram: '8GB', storage: '256GB', color: 'Space Gray', price: product?.price || 0, sku: `${product?.sku}-V1`, stock: 10 },
            ]);
        }
    }, [product]);

    const handleSaveAll = () => {
        if (product) {
            updateProduct({ ...product, variants: variants });
            navigate('/products');
        }
    };

    const addOptionValue = (optionId, newValue) => {
        if (!newValue.trim()) return;
        setOptions(options.map(opt => 
            opt.id === optionId ? { ...opt, values: [...opt.values, newValue] } : opt
        ));
    };

    const removeOptionValue = (optionId, valueToRemove) => {
        setOptions(options.map(opt => 
            opt.id === optionId ? { ...opt, values: opt.values.filter(v => v !== valueToRemove) } : opt
        ));
    };

    const removeOption = (optionId) => {
        setOptions(options.filter(opt => opt.id !== optionId));
    };

    const addOptionGroup = () => {
        const name = prompt('Enter option name (e.g. Material, Size):');
        if (name) {
            setOptions([...options, { id: Date.now(), name, values: [] }]);
        }
    };

    const columns = [
        {
          header: 'Specification',
          key: 'ram',
          render: (_, row) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-gray-900)]">
                    <Cpu size={14} className="text-[var(--color-primary)]" /> {row.ram} / {row.storage}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-[var(--color-gray-400)] uppercase tracking-wider">
                    <Palette size={12} /> {row.color}
                </div>
            </div>
          )
        },
        { 
          header: 'Price Adjustment', 
          key: 'price',
          render: (val) => <span className="text-[var(--color-primary)] font-black text-sm">₹{val.toLocaleString()}</span>
        },
        { 
          header: 'SKU Meta', 
          key: 'sku',
          render: (val) => <span className="text-[10px] font-black text-[var(--color-gray-500)] uppercase tracking-widest bg-[var(--color-gray-100)] px-2 py-1 rounded-lg">{val}</span>
        },
        { 
          header: 'Inventory', 
          key: 'stock',
          render: (val) => (
            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${val < 10 ? 'badge-action' : 'badge-live'}`}>
                {val} in stock
            </span>
          )
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                    <button onClick={() => navigate('/products')} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all card-shadow">
                        <ArrowLeft size={20} className="text-[var(--color-gray-900)]" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-[var(--color-gray-400)] uppercase tracking-widest mb-1">
                            Products <ChevronDown size={10} className="-rotate-90" /> Manage Variants
                        </div>
                        <h1 className="text-2xl font-semibold text-[var(--color-gray-900)] tracking-tight">Manage Specifications</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CustomButton variant="outline" onClick={handleSaveAll} className="px-6 border-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] font-bold rounded-2xl">
                        <Save size={18} className="mr-2" /> Save All Changes
                    </CustomButton>
                    <CustomButton onClick={() => {}} className="px-6 shadow-xl shadow-[var(--color-primary)]/20 bg-[var(--color-primary)] text-white border-none font-bold rounded-2xl">
                        <Sparkles size={18} className="mr-2" /> Auto-Generate SKUs
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Option Groups */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-[2rem] card-shadow border border-gray-100/50 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-[var(--color-gray-900)] tracking-tight flex items-center gap-2">
                                <Settings2 size={20} className="text-[var(--color-primary)]" /> Configuration Options
                            </h2>
                            <button onClick={addOptionGroup} className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-xl transition-all">
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {options.map(option => (
                                <div key={option.id} className="relative pl-6 border-l-2 border-[var(--color-gray-100)] group hover:border-[var(--color-primary)]/30 transition-all">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[var(--color-gray-200)] group-hover:border-[var(--color-primary)] transition-all"></div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-[var(--color-gray-800)] uppercase tracking-wider">{option.name}</h3>
                                        <button onClick={() => removeOption(option.id)} className="text-[var(--color-gray-300)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {option.values.map(val => (
                                            <span key={val} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gray-100)] text-[var(--color-gray-700)] text-xs font-bold rounded-xl group/val hover:bg-white border border-transparent hover:border-[var(--color-gray-200)] transition-all">
                                                {val}
                                                <button onClick={() => removeOptionValue(option.id, val)} className="text-[var(--color-gray-400)] hover:text-[var(--color-danger)] opacity-0 group-val-hover:opacity-100 transition-all">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Add value and press Enter..."
                                        className="w-full bg-[var(--color-gray-50)] border-none px-4 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addOptionValue(option.id, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Summary Mini-Card */}
                    <div className="bg-[var(--color-primary)] rounded-[2rem] p-8 text-white card-shadow overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Currently Configuring</h4>
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                                    <img src={product?.image} className="w-full h-full object-contain mix-blend-lighten" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black tracking-tight">{product?.name}</span>
                                    <span className="text-[11px] font-bold opacity-60 uppercase tracking-widest mt-0.5">Base Price: ₹{product?.price?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Right Column: Generated Variants Table */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-[2rem] card-shadow border border-gray-100/50 overflow-hidden">
                        <div className="p-8 border-b border-gray-100/50 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-xl font-black text-[var(--color-gray-900)] tracking-tight">Variants Summary</h2>
                                <p className="text-xs font-bold text-[var(--color-gray-400)] uppercase tracking-widest mt-1">{variants.length} combinations available</p>
                            </div>
                            <CustomButton variant="outline" className="border-[var(--color-gray-200)] text-[var(--color-gray-600)] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl h-auto">
                                <Filter size={14} className="mr-2" /> Filter List
                            </CustomButton>
                        </div>
                        <div className="mt-2">
                            <CustomTable 
                                columns={columns}
                                data={variants}
                                actions={(_row) => (
                                    <div className="flex items-center justify-end gap-1">
                                        <button className="p-2 text-[var(--color-gray-400)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-xl transition-all"><Edit3 size={16} /></button>
                                        <button className="p-2 text-[var(--color-gray-400)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            />
                        </div>
                        <div className="p-8 border-t border-gray-100/50 bg-gray-50/50">
                            <div className="flex items-center justify-center gap-4 text-xs font-bold text-[var(--color-gray-400)] uppercase tracking-widest">
                                <span>Note: Individual SKU pricing will override product base price</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageVariants;
