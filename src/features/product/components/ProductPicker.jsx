import React, { useState } from 'react';
import { ArrowRight, Box, Edit3, Filter, Layers, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import { useProductContext } from '../../../context/ProductContext';
import ProductFormModal from './ProductFormModal';

const ProductPicker = ({ mode = 'edit' }) => {
  const navigate = useNavigate();
  const { products, updateProduct } = useProductContext();
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAction = (product) => {
    if (mode === 'variants') {
      navigate(`/products/variants/${product.id}`);
      return;
    }

    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedProduct) => {
    updateProduct(updatedProduct);
    setIsEditModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-8 fade-in duration-500 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            {mode === 'variants' ? 'Select Product for Variants' : 'Select Product to Edit'}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Choose a catalog product to edit or prepare for advanced merchandising.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="group flex flex-1 items-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 transition-all focus-within:border-indigo-500 focus-within:bg-white">
          <Search size={18} className="mr-3 text-gray-300 transition-colors group-focus-within:text-indigo-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full border-none bg-transparent text-sm font-bold text-gray-700 outline-none"
          />
        </div>
        <CustomButton variant="outline" className="rounded-2xl px-5 py-3">
          <Filter size={18} />
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => handleAction(product)}
            className="group cursor-pointer rounded-3xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-black/[0.01] transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 p-2 transition-transform group-hover:scale-105">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                ) : (
                  <Box className="h-6 w-6 text-[var(--color-primary)]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 transition-colors group-hover:text-indigo-600">{product.name}</h3>
                <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-gray-400">{product.sku}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Base Price</span>
                <span className="text-sm font-black text-gray-900">Rs. {product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 transition-all group-hover:gap-3">
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
