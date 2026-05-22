import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { useProductContext } from '../../../context/ProductContext';
import CustomButton from '../../../components/custom/CustomButton';

const CreateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct } = useProductContext();
  const prefilledCategory = location.state?.category || '';
  const prefilledName = location.state?.sampleProduct || '';
  const prefilledBrand = location.state?.brand || '';
  const prefilledPrice = location.state?.price || '';

  const handleSave = (newProduct) => {
    addProduct(newProduct);
    navigate('/products');
  };

  return (
    <div className="w-full max-w-none space-y-6 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
            <Plus size={20} />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-gray-900)]">New Product</h1>
        </div>
        <CustomButton type="button" variant="outline" onClick={() => navigate('/products')} className="h-10 rounded-xl px-5">
          Back to Products
        </CustomButton>
      </div>

      <div className="surface-card rounded-[1.75rem] p-4 md:p-5 lg:p-6">
        <ProductForm
          initialValues={
            prefilledCategory || prefilledName || prefilledBrand || prefilledPrice
              ? {
                  category: prefilledCategory,
                  name: prefilledName,
                  brand: prefilledBrand,
                  price: prefilledPrice,
                }
              : undefined
          }
          onSubmit={handleSave}
          onCancel={() => navigate('/products')}
          mode="create"
        />
      </div>
    </div>
  );
};

export default CreateProduct;
