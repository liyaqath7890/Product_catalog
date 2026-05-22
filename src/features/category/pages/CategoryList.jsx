import React, { useState } from 'react';
import {
  Edit3,
  Eye,
  Gem,
  Headphones,
  Heart,
  Laptop,
  LayoutGrid,
  Plus,
  ShoppingBag,
  Shirt,
  Smartphone,
  Sparkles,
  Speaker,
  Tablet,
  Trash2,
  Watch,
  Download,
} from 'lucide-react';
import { useMatch, useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import StatusBadge from '../../../components/custom/StatusBadge';
import PageHeader from '../../../components/layout/PageHeader';
import { useCategoryContext } from '../../../context/CategoryContext';
import { useProductContext } from '../../../context/ProductContext';
import CategoryDrawer from '../components/CategoryDrawer';

const ICON_MAP = {
  Laptop,
  Smartphone,
  Speaker,
  Watch,
  Tablet,
  Headphones,
  LayoutGrid,
  Gem,
  Shirt,
  Sparkles,
  ShoppingBag,
  Heart,
};

const CategoryList = () => {
  const navigate = useNavigate();
  const createMatch = useMatch('/categories/create');
  const { categories, addCategory, deleteCategory } = useCategoryContext();
  const { products } = useProductContext();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const isCreateDrawerOpen = Boolean(createMatch);

  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.name).length,
  }));

  const filteredCategories = categoriesWithCounts.filter((category) => {
    const matchesTab = activeTab === 'All' || category.status === activeTab;
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleCategories = filteredCategories.slice(startIndex, startIndex + rowsPerPage);
  const tabs = ['All', 'Active', 'Scheduled', 'Inactive'];
  const getTabCount = (status) =>
    categoriesWithCounts.filter((category) => status === 'All' || category.status === status).length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, searchQuery]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id);
    }
  };

  const handleExportCategories = () => {
    const headers = ['Category', 'Products Qty', 'Description', 'Status', 'Featured'];
    const rows = filteredCategories.map((category) => [
      category.name,
      category.count,
      category.description,
      category.status,
      category.status === 'Active' ? 'Yes' : 'No',
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
    link.download = 'categories.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Category',
      key: 'name',
      width: '34%',
      render: (value, category) => {
        const IconComponent = ICON_MAP[category.iconName] || LayoutGrid;

        return (
          <div className="flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--table-grid)] ${category.bg}`}>
              {category.image ? (
                <img src={category.image} alt={category.name} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <IconComponent className={`h-5 w-5 ${category.color}`} />
              )}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-gray-900)]">{value}</p>
              <p className="mt-1 text-xs text-[var(--table-subtext)]">Slug: {category.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Products Qty',
      key: 'count',
      width: '13%',
      sortable: false,
      render: (value) => <span className="whitespace-nowrap font-semibold text-[var(--color-gray-900)]">{value}</span>,
    },
    { header: 'Description', key: 'description' },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      header: 'Featured',
      key: 'featured',
      align: 'center',
      sortable: false,
      render: (_, category) => (
        <input type="checkbox" checked={category.status === 'Active'} readOnly className="h-4 w-4 accent-[var(--color-primary)]" />
      ),
    },
  ];

  const actions = (category) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => navigate(`/categories/details/${category.id}`)}
        className="rounded-lg p-1.5 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
        title="View category"
      >
        <Eye size={16} />
      </button>
      <button
        type="button"
        onClick={() => navigate(`/categories/edit/${category.id}`)}
        className="rounded-lg p-1.5 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={16} />
      </button>
      <button
        type="button"
        onClick={() => handleDelete(category.id)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-5 overflow-hidden animate-in fade-in duration-700">
      <PageHeader
        title="Category List"
        description="Scan categories, their product counts, and status at a glance."
        backLabel="Back to Dashboard"
        onBack={() => navigate('/')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleExportCategories}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-[12px] font-semibold"
            >
              <Download size={16} />
              Export
            </CustomButton>
            <CustomButton
              onClick={() => navigate('/categories/create')}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-[12px] font-semibold"
            >
              <Plus size={18} /> Create Category
            </CustomButton>
          </>
        }
      />

      <div className="min-h-0 flex-1">
        <CustomTable
          columns={columns}
          data={visibleCategories}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getTabCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          actions={actions}
          onRowClick={(category) => navigate(`/categories/details/${category.id}`)}
          showFilters={false}
          fillHeight
          footer={
            <CustomTableFooter
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              summary={`Showing ${filteredCategories.length === 0 ? 0 : startIndex + 1} - ${Math.min(filteredCategories.length, startIndex + visibleCategories.length)} of ${filteredCategories.length} categories`}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          }
        />
      </div>

      <CategoryDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => navigate('/categories')}
        onSave={(category) => {
          addCategory(category);
          navigate('/categories');
        }}
      />
    </div>
  );
};

export default CategoryList;
