import React, { useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Box, Download, Edit3, Eye, Package, Trash2 } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import ProductDetailModal from '../../../components/custom/ProductDetailModal';
import { useProductContext } from '../../../context/ProductContext';
import ProductFormModal from '../../product/components/ProductFormModal';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const InventoryDashboard = () => {
  const { products, deleteProduct, updateProduct, addProduct } = useProductContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const getStockStatus = (product) => {
    const stock = product.qty || product.stock || 0;
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  };

  const filteredProducts = products.filter((product) => {
    const lookup = `${product.name} ${product.sku} ${product.category} ${product.subcategory}`.toLowerCase();
    const matchesSearch = lookup.includes(searchQuery.toLowerCase());
    const matchesFilter = stockFilter === 'All' || getStockStatus(product) === stockFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedViewProduct(product);
    setIsViewModalOpen(true);
  };

  const handleSave = (updated) => {
    if (selectedProduct) {
      updateProduct(updated);
    } else {
      addProduct(updated);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      deleteProduct(id);
    }
  };

  const handleExportInventory = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Subcategory', 'Stock Level', 'Unit Price', 'Status'];
    const rows = filteredProducts.map((product) => [
      product.sku,
      product.name,
      product.category,
      product.subcategory || '',
      product.qty || product.stock || 0,
      product.price,
      getStockStatus(product),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory-stock.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(true);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, searchQuery, stockFilter]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const columns = [
    { header: 'SKU', key: 'sku' },
    {
      header: 'Product Name',
      key: 'name',
      width: '32%',
      render: (value, product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-1.5">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-gray-900)]">{value}</p>
            <p className="mt-1 text-xs text-[var(--table-subtext)]">
              {[product.category, product.subcategory].filter(Boolean).join(' / ')}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Stock Level',
      key: 'stock',
      render: (_, product) => {
        const stock = product.qty || product.stock || 0;
        const percentage = Math.min((stock / 100) * 100, 100);

        return (
          <div className="w-36 space-y-1.5">
            <div className="flex justify-between text-xs text-[var(--color-gray-600)]">
              <span>{stock} units</span>
              <span>100 max</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--table-grid)]">
              <div
                className={`h-full ${stock === 0 ? 'bg-[#F1416C]' : stock < 10 ? 'bg-[#FFC700]' : 'bg-[#50CD89]'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Unit Price',
      key: 'price',
      render: (value) => <span className="font-semibold text-[var(--color-gray-900)]">{formatCurrency(value)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (_, product) => {
        const status = getStockStatus(product);
        const statusClasses =
          status === 'Out of Stock'
            ? 'bg-[#FFF5F8] text-[#F1416C]'
            : status === 'Low Stock'
              ? 'bg-[#FFF8DD] text-[#C99800]'
              : 'bg-[#E8FFF3] text-[#50CD89]';

        return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`}>{status}</span>;
      },
    },
  ];

  const actions = (product) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => handleView(product)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
        title="View stock item"
      >
        <Eye size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleEdit(product)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleDelete(product.id)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-5 overflow-hidden animate-in fade-in duration-700">
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-gray-900)]">Stock Inventory</h1>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton
            type="button"
            variant="outline"
            onClick={handleExportInventory}
            className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold"
          >
            <Download size={18} className="mr-2" />
            Export Report
          </CustomButton>
          <CustomButton
            type="button"
            onClick={handleOpenCreate}
            className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold"
          >
            <Package size={18} /> Add Stock
          </CustomButton>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total SKU', value: products.length, icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Out of Stock', value: products.filter((p) => p.qty === 0 || p.stock === 0).length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Inbound Orders', value: '45', icon: ArrowDownRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Outbound Orders', value: '89', icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-5 transition-standard hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-3 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">+4.2%</span>
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-[var(--color-gray-900)]">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <CustomTable
          columns={columns}
          data={visibleProducts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          actions={actions}
          title="Inventory List"
          toolbarActions={
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className="h-11 min-w-[190px] rounded-xl border border-[var(--color-gray-200)] bg-white px-4 text-sm font-semibold text-[var(--table-text)] outline-none"
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          }
          showFilters={false}
          fillHeight
          footer={
            <CustomTableFooter
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              summary={`Showing ${filteredProducts.length === 0 ? 0 : startIndex + 1} - ${Math.min(filteredProducts.length, startIndex + visibleProducts.length)} of ${filteredProducts.length} stock records`}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>

      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        mode={selectedProduct ? 'edit' : 'create'}
        onSave={handleSave}
      />

      <ProductDetailModal
        isOpen={isViewModalOpen}
        product={selectedViewProduct}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEdit}
        onRemove={() => selectedViewProduct && handleDelete(selectedViewProduct.id)}
      />
    </div>
  );
};

export default InventoryDashboard;
