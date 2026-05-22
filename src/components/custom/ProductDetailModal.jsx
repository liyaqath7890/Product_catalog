import React, { useMemo, useState } from 'react';
import { BarChart3, DollarSign, Edit3, Layers, Star, Trash2, TrendingUp, X } from 'lucide-react';
import CustomButton from './CustomButton';
import CustomTable from './CustomTable';
import { useProductContext } from '../../context/ProductContext';

const SparkLine = ({ color }) => (
  <svg viewBox="0 0 100 30" className="mt-4 h-14 w-full">
    <defs>
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.25 }} />
        <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
      </linearGradient>
    </defs>
    <path d="M0,25 Q15,15 30,22 T60,10 T100,18" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d={`M0,25 Q15,15 30,22 T60,10 T100,18 V30 H0 Z`} fill={`url(#grad-${color.replace('#', '')})`} />
  </svg>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onRemove }) => {
  const { products } = useProductContext();
  const [activeImage, setActiveImage] = useState(0);

  const gallery = product?.imageGallery?.length ? product.imageGallery : product?.image ? [product.image] : [];

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  }, [product, products]);

  if (!isOpen || !product) return null;

  const currentImage = gallery[activeImage] || product.image;
  const totalOnHand = product.variants?.reduce((sum, variant) => sum + Number(variant.onHand || 0), 0) || product.stock || 0;
  const liveVariants = product.variants?.filter((variant) => Number(variant.onHand) > 0).length || 0;
  const statusStyles = {
    Live: 'badge-live',
    Draft: 'badge-draft',
    Archived: 'badge-archived',
    'Action Needed': 'badge-action',
  };

  const variantColumns = [
    { header: 'Size', key: 'size', render: (value) => <span className="font-semibold text-[var(--color-gray-900)]">{value || 'Standard'}</span> },
    { header: 'Color', key: 'color' },
    { header: 'Price', key: 'price', render: (value) => <span className="font-semibold text-[var(--color-gray-900)]">{formatCurrency(value || product.price)}</span> },
    { header: 'Available', key: 'available', render: (_, row) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${Number(row.onHand) > 0 ? 'bg-[#E8FFF3] text-[#50CD89]' : 'bg-[#FFF5F8] text-[#F1416C]'}`}>{Number(row.onHand) > 0 ? 'Yes' : 'No'}</span> },
    { header: 'On Hand', key: 'onHand' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[var(--color-dark)]/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-[var(--surface-page)] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-[var(--table-grid)] bg-white px-8 py-5">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-gray-900)]">Product Details</h3>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">View product media, variant stock, and similar products.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-[var(--color-gray-900)]">{product.name}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[product.status] || 'badge-live'}`}>{product.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-gray-500)]">
                <span>SKU: <span className="font-semibold text-[var(--color-gray-800)]">{product.sku}</span></span>
                <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                <span>Brand: <span className="font-semibold text-[var(--color-gray-800)]">{product.brand}</span></span>
                <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                <span>Updated: <span className="font-semibold text-[var(--color-gray-800)]">{product.date}</span></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--table-grid)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition-standard hover:bg-[#FFF5F8]"
              >
                <Trash2 size={16} /> Remove
              </button>
              <CustomButton onClick={() => onEdit(product)} className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold">
                <Edit3 size={16} /> Edit Product
              </CustomButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="surface-card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Sale Price</p>
                      <h3 className="mt-2 text-3xl font-semibold text-[var(--color-gray-900)]">{formatCurrency(product.price)}</h3>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <SparkLine color="#0095E8" />
                </div>

                <div className="surface-card p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Live Variants</p>
                      <h3 className="mt-2 text-3xl font-semibold text-[var(--color-gray-900)]">{liveVariants}</h3>
                    </div>
                    <div className="rounded-2xl bg-[#E8FFF3] p-3 text-[#50CD89]">
                      <BarChart3 size={18} />
                    </div>
                  </div>
                  <SparkLine color="#50CD89" />
                </div>
              </div>

              <div className="surface-card p-6">
                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Inventory Summary</h4>
                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-[var(--color-gray-500)]">Category</p>
                    <p className="mt-1 font-semibold text-[var(--color-gray-900)]">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-500)]">On Hand</p>
                    <p className="mt-1 font-semibold text-[var(--color-gray-900)]">{totalOnHand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-500)]">Rating</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-semibold text-[var(--color-gray-900)]"><Star size={14} className="fill-[#FFC700] text-[#FFC700]" /> {product.rating?.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-500)]">Demand</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-semibold text-[#50CD89]"><TrendingUp size={14} /> Strong</p>
                  </div>
                </div>
              </div>

              <div className="surface-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-6 py-4">
                  <h4 className="text-sm font-semibold text-[var(--color-gray-900)]">Variants</h4>
                  <button type="button" onClick={() => onEdit(product)} className="text-sm font-semibold text-[var(--color-primary)]">Manage variants</button>
                </div>
                <CustomTable columns={variantColumns} data={product.variants || []} showFilters={false} />
              </div>

              <div className="surface-card p-6">
                <h4 className="text-sm font-semibold text-[var(--color-gray-900)]">Product Description</h4>
                <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">{product.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(product.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--color-primary-light)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="surface-card p-6">
                <div className="overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-muted)]">
                  <img src={currentImage} alt={product.name} className="h-[280px] w-full object-cover" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-xl border p-1 transition-standard ${activeImage === index ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/40' : 'border-[var(--table-grid)] bg-[var(--surface-muted)]'}`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="h-20 w-full rounded-lg object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6">
                <h4 className="text-sm font-semibold text-[var(--color-gray-900)]">Product Highlights</h4>
                <ul className="mt-4 space-y-3">
                  {(product.features || []).map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--color-gray-600)]">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-6">
                <h4 className="text-sm font-semibold text-[var(--color-gray-900)]">Similar Products</h4>
                <div className="mt-4 space-y-4">
                  {relatedProducts.length > 0 ? (
                    relatedProducts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveImage(0);
                          onEdit(item);
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl border border-transparent bg-[var(--surface-muted)] p-3 text-left transition-standard hover:border-[var(--table-grid)] hover:bg-white"
                      >
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-[var(--color-gray-900)]">{item.name}</p>
                          <p className="mt-1 text-xs text-[var(--color-gray-500)]">{item.category}</p>
                          <p className="mt-1 text-sm font-semibold text-[var(--color-gray-900)]">{formatCurrency(item.price)}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--color-gray-500)]">No similar products available in this category yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
