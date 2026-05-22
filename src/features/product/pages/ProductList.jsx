import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Edit3, Eye, Plus, Star, Trash2, X } from 'lucide-react';
import ProductDetailModal from '../../../components/custom/ProductDetailModal';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import StatusBadge from '../../../components/custom/StatusBadge';
import PageHeader from '../../../components/layout/PageHeader';
import { useProductContext } from '../../../context/ProductContext';
import ProductFormModal from '../components/ProductFormModal';
import ProductVariantDrawer from '../components/ProductVariantDrawer';
import CustomButton from '../../../components/custom/CustomButton';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const createMatch = useMatch('/products/create');
  const variantsIndexMatch = useMatch('/products/variants');
  const variantsMatch = useMatch('/products/variants/:productId');
  const { products, updateProduct, deleteProduct, deleteProducts, addProduct } = useProductContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
  const [isVariantPickerOpen, setIsVariantPickerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [variantProduct, setVariantProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [createPrefillValues, setCreatePrefillValues] = useState(null);

  const tabs = ['All', 'Live', 'Draft', 'Archived', 'Action Needed'];
  const isCreateRoute = Boolean(createMatch);
  const isVariantPickerRoute = Boolean(variantsIndexMatch) && !variantsMatch;

  useEffect(() => {
    if (!isCreateRoute) {
      return;
    }

    setEditProduct(null);
    setCreatePrefillValues(location.state?.category ? { category: location.state.category } : null);
    setIsEditModalOpen(true);
  }, [isCreateRoute, location.state]);

  useEffect(() => {
    setIsVariantPickerOpen(isVariantPickerRoute);
  }, [isVariantPickerRoute]);

  useEffect(() => {
    if (!variantsMatch) {
      setIsVariantDrawerOpen(false);
      setVariantProduct(null);
      return;
    }

    const matchedProduct = products.find((product) => String(product.id) === String(variantsMatch.params.productId));
    if (matchedProduct) {
      setVariantProduct(matchedProduct);
      setIsVariantDrawerOpen(true);
    }
  }, [products, variantsMatch]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesTab = activeTab === 'All' || product.status === activeTab;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
      }),
    [activeTab, products, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  const getCount = (status) => products.filter((product) => status === 'All' || product.status === status).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleOpenVariants = (product) => {
    setVariantProduct(product);
    setIsVariantDrawerOpen(true);
    navigate(`/products/variants/${product.id}`);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCreatePrefillValues(null);
    if (isCreateRoute) {
      navigate('/products');
    }
  };

  const handleCloseVariantDrawer = () => {
    setIsVariantDrawerOpen(false);
    setVariantProduct(null);
    if (variantsMatch) {
      navigate('/products');
    }
  };

  const handleCloseVariantPicker = () => {
    setIsVariantPickerOpen(false);
    if (isVariantPickerRoute) {
      navigate('/products');
    }
  };

  const handleSave = (updatedProduct) => {
    if (editProduct) {
      updateProduct(updatedProduct);
    } else {
      addProduct(updatedProduct);
    }

    setIsEditModalOpen(false);
    setCreatePrefillValues(null);
    if (isCreateRoute) {
      navigate('/products');
    }
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const handleRemove = (product) => {
    if (window.confirm(`Are you sure you want to remove "${product.name}"?`)) {
      handleDelete(product.id);
    }
  };

  const handleExportProducts = () => {
    const headers = ['Name', 'SKU', 'Category', 'Brand', 'Price', 'Status', 'Stock'];
    const rows = filteredProducts.map((product) => [
      product.name,
      product.sku,
      [product.category, product.subcategory].filter(Boolean).join(' / '),
      product.brand,
      product.price,
      product.status,
      product.stock ?? product.qty ?? 0,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalog-products.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Product Info',
      key: 'name',
      width: '34%',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-1.5">
            <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-gray-900)]">{value}</p>
            <p className="mt-1 text-xs text-[var(--table-subtext)]">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-[var(--color-gray-900)]">{value}</p>
          {row.subcategory ? <p className="mt-1 text-xs text-[var(--table-subtext)]">{row.subcategory}</p> : null}
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
          {value.toFixed(1)}
        </span>
      ),
    },
    { header: 'Updated', key: 'date' },
  ];

  const actions = (product) => (
    <div className="flex items-center justify-end gap-1">
      <button type="button" title="View Product" className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]" onClick={() => handleOpenDetail(product)}>
        <Eye size={18} />
      </button>
      <button type="button" title="Edit Product" className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]" onClick={() => handleOpenEdit(product)}>
        <Edit3 size={18} />
      </button>
      <button type="button" title="Delete Product" className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]" onClick={() => handleRemove(product)}>
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-3 overflow-hidden animate-in fade-in duration-700">
      <PageHeader
        title="Product List"
        description="Track products, status, and quick actions from one responsive table."
        backLabel="Back to Dashboard"
        onBack={() => navigate('/')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleExportProducts}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              <Download size={16} />
              Export
            </CustomButton>
            <CustomButton
              type="button"
              onClick={() => navigate('/products/create-page')}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              <Plus size={18} />
              New Product
            </CustomButton>
          </>
        }
      />

      {selectedRows.length > 0 ? (
        <div className="shrink-0 flex items-center justify-between rounded-[1.5rem] border border-[var(--color-primary)]/10 bg-[var(--color-primary-light)] p-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[var(--color-primary)]">{selectedRows.length} selected</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete ${selectedRows.length} products?`)) {
                  deleteProducts(selectedRows);
                  setSelectedRows([]);
                }
              }}
              className="rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition-standard hover:border-[var(--color-danger)]/10 hover:bg-white"
            >
              Delete Items
            </button>
          </div>
          <button type="button" onClick={() => setSelectedRows([])} className="rounded-full p-2 text-[var(--color-primary)] transition-standard hover:bg-white">
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1">
        <CustomTable
          columns={columns}
          data={paginatedProducts}
          selectable
          selectedRows={selectedRows}
          onSelectRow={toggleRowSelection}
          onSelectAll={(checked) => setSelectedRows(checked ? paginatedProducts.map((product) => product.id) : [])}
          actions={actions}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRowClick={handleOpenDetail}
          showFilters={false}
          fillHeight
          minWidth={900}
          tableClassName="text-[13px]"
          footer={
            <CustomTableFooter
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              summary={`Showing ${filteredProducts.length === 0 ? 0 : startIndex + 1} - ${Math.min(filteredProducts.length, startIndex + paginatedProducts.length)} of ${filteredProducts.length} products`}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>

      <ProductDetailModal isOpen={isDetailModalOpen} product={selectedProduct} onClose={() => setIsDetailModalOpen(false)} onEdit={handleOpenEdit} onRemove={() => selectedProduct && handleRemove(selectedProduct)} />

      <ProductFormModal
        isOpen={isEditModalOpen}
        product={editProduct ?? createPrefillValues}
        mode={editProduct ? 'edit' : 'create'}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      <ProductVariantDrawer
        isOpen={isVariantDrawerOpen}
        product={variantProduct}
        onClose={handleCloseVariantDrawer}
        onSave={(updatedProduct) => {
          updateProduct(updatedProduct);
          handleCloseVariantDrawer();
        }}
      />

      <VariantProductPickerDrawer
        isOpen={isVariantPickerOpen}
        products={products}
        onClose={handleCloseVariantPicker}
        onSelect={(product) => {
          setIsVariantPickerOpen(false);
          handleOpenVariants(product);
        }}
      />
    </div>
  );
};

const VariantProductPickerDrawer = ({ isOpen, products, onClose, onSelect }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const value = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(value) ||
          product.sku.toLowerCase().includes(value) ||
          product.category.toLowerCase().includes(value) ||
          product.subcategory.toLowerCase().includes(value)
        );
      }),
    [products, query],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[65] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-[420px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="border-b border-[var(--table-grid)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">Select Product</h2>
              <p className="mt-1 text-sm text-[var(--color-gray-500)]">
                Pick a product first, then we will open the variant manager in the right drawer.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product by name, SKU, or category"
              className="control-shell w-full px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelect(product)}
                className="flex w-full items-center gap-4 rounded-2xl border border-[var(--table-grid)] bg-white p-4 text-left transition-standard hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-primary-light)]/50"
              >
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-1.5">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-gray-900)]">{product.name}</p>
                  <p className="mt-1 text-xs text-[var(--table-subtext)]">
                    {[product.category, product.subcategory].filter(Boolean).join(' / ')} • {product.sku}
                  </p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-[var(--color-primary)]" />
              </button>
            ))}

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] px-5 py-10 text-center">
                <p className="text-sm font-semibold text-[var(--color-gray-800)]">No products found</p>
                <p className="mt-1 text-sm text-[var(--color-gray-500)]">
                  Try a different name, SKU, or category.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProductList;
