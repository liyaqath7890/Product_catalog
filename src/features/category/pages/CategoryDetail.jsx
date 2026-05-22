import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit3, Plus, Star, Trash2, Eye } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import PageHeader from '../../../components/layout/PageHeader';
import ProductDetailModal from '../../../components/custom/ProductDetailModal';
import StatusBadge from '../../../components/custom/StatusBadge';
import { useCategoryContext } from '../../../context/CategoryContext';
import { useProductContext } from '../../../context/ProductContext';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const CATEGORY_SAMPLES = {
  Shoes: [
    { name: 'Air Flex Sprint', brand: 'Nike', price: 6999, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Street Lift Runner', brand: 'Adidas', price: 6299, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pace Storm Trainer', brand: 'Puma', price: 5799, rating: 4.6, status: 'Draft', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cloud Sprint Knit', brand: 'Reebok', price: 5199, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Retro Court Ace', brand: 'New Balance', price: 7499, rating: 4.9, status: 'Live', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
    { name: 'Urban Trek High', brand: 'Converse', price: 4899, rating: 4.4, status: 'Archived', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80' },
    { name: 'Active Motion X', brand: 'Asics', price: 6699, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Prime Run Next', brand: 'Skechers', price: 4599, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cushion Glide', brand: 'Fila', price: 3899, rating: 4.3, status: 'Action Needed', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mono Street Sole', brand: 'Vans', price: 4299, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80' },
  ],
  Fashion: [
    { name: 'Satin Drape Midi', brand: 'Zara', price: 4199, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Minimal Linen Set', brand: 'H&M', price: 3599, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tailored City Blazer', brand: 'Mango', price: 5299, rating: 4.7, status: 'Archived', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Soft Pleat Dress', brand: 'Forever 21', price: 2999, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Weekend Denim Jacket', brand: 'Levis', price: 4799, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Relaxed Knit Co-ord', brand: 'Uniqlo', price: 3899, rating: 4.6, status: 'Draft', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80' },
    { name: 'Evening Sheen Gown', brand: 'Biba', price: 6499, rating: 4.9, status: 'Live', image: 'https://images.unsplash.com/photo-1506629905607-d9b1d215f3d2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cropped Utility Shirt', brand: 'Only', price: 2599, rating: 4.3, status: 'Action Needed', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Modern Wrap Top', brand: 'Vero Moda', price: 2299, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80' },
    { name: 'Structured Office Set', brand: 'Marks & Spencer', price: 5899, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80' },
  ],
  Beauty: [
    { name: 'Velvet Bloom Lip Kit', brand: 'Rare Beauty', price: 2299, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' },
    { name: 'Glow Veil Routine Set', brand: 'The Ordinary', price: 3199, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1556228578-dd6f3f5f63d9?auto=format&fit=crop&w=600&q=80' },
    { name: 'Silk Ease Night Serum', brand: 'Laneige', price: 2749, rating: 4.9, status: 'Live', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hydra Dew Toner', brand: 'Clinique', price: 1999, rating: 4.5, status: 'Draft', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80' },
    { name: 'Radiance Base Primer', brand: 'Maybelline', price: 1599, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cloud Lash Mascara', brand: 'Lakme', price: 999, rating: 4.3, status: 'Live', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Soft Matte Cushion', brand: 'MAC', price: 2899, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80' },
    { name: 'Crystal Glow Mist', brand: 'Pixi', price: 1799, rating: 4.6, status: 'Archived', image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Peptide Eye Cream', brand: 'Minimalist', price: 1249, rating: 4.5, status: 'Action Needed', image: 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=600&q=80' },
    { name: 'Soft Rose Blush Duo', brand: 'Huda Beauty', price: 2149, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=600&q=80' },
  ],
  Bags: [
    { name: 'Contour Luxe Handbag', brand: 'Coach', price: 5899, rating: 4.6, status: 'Action Needed', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
    { name: 'Metro Mini Crossbody', brand: 'Michael Kors', price: 6799, rating: 4.7, status: 'Live', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Weekend Canvas Tote', brand: 'Fossil', price: 3499, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Classic Office Carryall', brand: 'Aldo', price: 5299, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Soft Quilted Satchel', brand: 'Charles & Keith', price: 4899, rating: 4.6, status: 'Live', image: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Travel Day Duffel', brand: 'Tommy Hilfiger', price: 4599, rating: 4.3, status: 'Draft', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Monogram Bucket Bag', brand: 'Kate Spade', price: 7199, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Chain Strap Mini', brand: 'Guess', price: 4299, rating: 4.5, status: 'Archived', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Commuter Sling Bag', brand: 'Baggit', price: 2399, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Structured Evening Clutch', brand: 'Lavie', price: 1999, rating: 4.2, status: 'Live', image: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=600&q=80' },
  ],
  Accessories: [
    { name: 'Gold Tone Hoop Set', brand: 'Accessorize', price: 899, rating: 4.6, status: 'Live', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80' },
    { name: 'Silk Print Scarf', brand: 'Zara', price: 1299, rating: 4.4, status: 'Live', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80' },
    { name: 'Minimal Leather Belt', brand: 'H&M', price: 1199, rating: 4.3, status: 'Live', image: 'https://images.unsplash.com/photo-1611923134239-b9be5816f4e3?auto=format&fit=crop&w=600&q=80' },
    { name: 'Crystal Charm Bracelet', brand: 'Pandora', price: 2299, rating: 4.8, status: 'Live', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80' },
    { name: 'Classic Dial Watch', brand: 'Titan', price: 4599, rating: 4.7, status: 'Draft', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80' },
    { name: 'Layered Pendant Set', brand: 'Myntra House', price: 1499, rating: 4.5, status: 'Live', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80' },
    { name: 'Oversized Frame Shades', brand: 'Ray-Ban', price: 5299, rating: 4.9, status: 'Live', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
    { name: 'Everyday Stud Set', brand: 'Forever 21', price: 799, rating: 4.2, status: 'Live', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
    { name: 'Slim Card Holder', brand: 'Tommy Hilfiger', price: 1899, rating: 4.4, status: 'Action Needed', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pearl Finish Hair Clip', brand: 'Aldo', price: 699, rating: 4.1, status: 'Archived', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80' },
  ],
};

const buildShowcaseProducts = (categoryName, products) => {
  const existing = products
    .filter((product) => product.category === categoryName)
    .map((product) => ({
      id: `existing-${product.id}`,
      name: product.name,
      brand: product.brand,
      price: product.price,
      rating: product.rating,
      status: product.status,
      image: product.image,
      source: 'catalog',
    }));

  const samples = (CATEGORY_SAMPLES[categoryName] || []).map((product, index) => ({
    id: `sample-${categoryName}-${index + 1}`,
    ...product,
    source: 'sample',
  }));

  const merged = [...existing];
  for (const sample of samples) {
    if (merged.length >= 10) break;
    if (!merged.some((item) => item.name === sample.name)) {
      merged.push(sample);
    }
  }

  return merged.slice(0, 10);
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategoryContext();
  const { products, deleteProduct } = useProductContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const category = categories.find((item) => String(item.id) === String(id));

  const showcaseProducts = useMemo(() => {
    if (!category) return [];
    return buildShowcaseProducts(category.name, products);
  }, [category, products]);

  const filteredProducts = useMemo(
    () =>
      showcaseProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.status.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, showcaseProducts],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  const uniqueBrands = new Set(showcaseProducts.map((product) => product.brand)).size;
  const averageRating =
    showcaseProducts.length > 0
      ? (showcaseProducts.reduce((sum, product) => sum + Number(product.rating || 0), 0) / showcaseProducts.length).toFixed(1)
      : '0.0';
  const liveCount = showcaseProducts.filter((product) => product.status === 'Live').length;
  const averagePrice =
    showcaseProducts.length > 0
      ? formatCurrency(
          Math.round(showcaseProducts.reduce((sum, product) => sum + Number(product.price || 0), 0) / showcaseProducts.length),
        )
      : formatCurrency(0);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, searchQuery, category?.id]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 pb-12 animate-in fade-in duration-700">
        <CustomButton variant="outline" onClick={() => navigate('/categories')} className="h-11 rounded-xl px-5">
          <ArrowLeft size={18} /> Back to Categories
        </CustomButton>
        <div className="rounded-[1.5rem] border border-[var(--table-grid)] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--color-gray-900)]">Category not found</h1>
          <p className="mt-2 text-sm text-[var(--color-gray-500)]">This category may have been removed or the link is no longer valid.</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      header: 'Product',
      key: 'name',
      width: '40%',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-1.5">
            <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-gray-900)]">{value}</p>
            <p className="mt-1 text-xs text-[var(--table-subtext)]">Brand: {row.brand}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      key: 'price',
      render: (value) => <span className="font-semibold text-[var(--color-gray-900)]">{formatCurrency(value)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      header: 'Rating',
      key: 'rating',
      render: (value) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF8DD] px-2.5 py-1 text-xs font-semibold text-[#C99800]">
          <Star size={12} className="fill-[#FFC700] text-[#FFC700]" />
          {Number(value).toFixed(1)}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'source',
      render: (value) => (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gray-500)]">
          {value === 'catalog' ? 'Catalog' : 'Sample'}
        </span>
      ),
    },
  ];

  const actions = (product) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => {
          setSelectedProduct(product);
          setIsDetailModalOpen(true);
        }}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
        title="View product"
      >
        <Eye size={18} />
      </button>
      <button
        type="button"
        onClick={() =>
          navigate('/products/create-page', {
            state: { category: category.name, sampleProduct: product.name, brand: product.brand, price: product.price },
          })
        }
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
        title="Edit product"
      >
        <Edit3 size={18} />
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete "${product.name}" from this category?`)) {
            deleteProduct(product.id);
          }
        }}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
        title="Delete product"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-in fade-in duration-700">
      <PageHeader
        title={category.name}
        description={`Explore curated products for ${category.name}.`}
        backLabel="Back to Categories"
        onBack={() => navigate('/categories')}
        actions={
          <>
            <CustomButton variant="outline" onClick={() => navigate(`/categories/edit/${category.id}`)} className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold">
              Edit Category
            </CustomButton>
            <CustomButton
              onClick={() => navigate('/products/create-page', { state: { category: category.name } })}
              className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold"
            >
              <Plus size={18} /> Add Product
            </CustomButton>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Products Shown', value: showcaseProducts.length, helper: `${category.count} listed in category` },
          { label: 'Brand Variety', value: uniqueBrands, helper: 'Up to 10 category brands' },
          { label: 'Average Rating', value: averageRating, helper: `${liveCount} live products right now` },
          { label: 'Average Price', value: averagePrice, helper: 'Based on current showcase mix' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[1.5rem] border border-[var(--table-grid)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gray-500)]">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--color-gray-900)]">{stat.value}</p>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">{stat.helper}</p>
          </div>
        ))}
      </div>

      <CustomTable
        title={`${category.name} Catalog`}
        subtitle={`Showing category-matched products and curated brand samples for ${category.name.toLowerCase()}.`}
        columns={columns}
        data={visibleProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={false}
        actions={actions}
        bodyMaxHeight="520px"
        emptyTitle={`No ${category.name.toLowerCase()} products found`}
        emptyDescription="Try another search term or add a new product to this category."
        footer={
          <CustomTableFooter
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            summary={`Showing ${filteredProducts.length === 0 ? 0 : startIndex + 1} - ${Math.min(filteredProducts.length, startIndex + visibleProducts.length)} of ${filteredProducts.length} ${category.name.toLowerCase()} items`}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        product={selectedProduct}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
};

export default CategoryDetail;
