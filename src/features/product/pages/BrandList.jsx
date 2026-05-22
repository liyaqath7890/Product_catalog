import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import CustomSearchBar from '../../../components/custom/CustomSearchBar';
import { useToast } from '../../../components/feedback/ToastProvider';
import PageHeader from '../../../components/layout/PageHeader';
import BrandDrawer from '../components/BrandDrawer';
import BrandTable from '../components/BrandTable';

const INITIAL_BRANDS = [
  {
    id: 1,
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    description: 'Global sportswear brand focused on footwear, apparel, and performance gear.',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    description: 'Lifestyle and athletic brand with strong footwear and streetwear collections.',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Rare Beauty',
    logo: 'https://seeklogo.com/images/R/rare-beauty-logo-27DCA7F14E-seeklogo.com.png',
    description: 'Beauty brand known for clean packaging, inclusive shades, and premium makeup essentials.',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Coach',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Coach_New_York_logo.svg',
    description: 'Leather goods and luxury accessories label with handbags and seasonal collections.',
    status: 'Inactive',
  },
  {
    id: 5,
    name: 'Zara',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
    description: 'Fast-fashion brand offering trend-driven apparel and wardrobe essentials.',
    status: 'Active',
  },
];

const BrandList = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');

  const tabs = ['All', 'Active', 'Inactive'];

  const filteredBrands = useMemo(
    () =>
      brands.filter((brand) => {
        const query = searchQuery.toLowerCase();
        const matchesTab = activeTab === 'All' || brand.status === activeTab;

        return (
          matchesTab &&
          (brand.name.toLowerCase().includes(query) ||
            brand.description.toLowerCase().includes(query) ||
            brand.status.toLowerCase().includes(query))
        );
      }),
    [activeTab, brands, searchQuery],
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, searchQuery]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredBrands.length / rowsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredBrands.length, rowsPerPage]);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (brand) => {
    setEditingBrand(brand);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setEditingBrand(null);
    setIsDrawerOpen(false);
    setDrawerMode('create');
  };

  const handleSaveBrand = (brand) => {
    if (editingBrand) {
      setBrands((current) =>
        current.map((item) => (item.id === editingBrand.id ? { ...item, ...brand, id: editingBrand.id } : item)),
      );
      success('Brand updated', `${brand.name} changes were saved.`);
    } else {
      setBrands((current) => [{ ...brand, id: Date.now() }, ...current]);
      success('Brand added', `${brand.name} was added successfully.`);
    }

    handleCloseDrawer();
  };

  const handleDeleteBrand = (brand) => {
    if (!window.confirm(`Delete "${brand.name}" from the brand list?`)) {
      return;
    }

    setBrands((current) => current.filter((item) => item.id !== brand.id));
    success('Brand deleted', `${brand.name} was removed from the brand list.`);
  };

  const getTabCount = (tab) => brands.filter((brand) => tab === 'All' || brand.status === tab).length;

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-5 overflow-hidden animate-in fade-in duration-700">
      <PageHeader
        title="Brands"
        description="Review brand status, open details, and manage catalog records from one place."
        backLabel="Back to Dashboard"
        onBack={() => navigate('/')}
        actions={
          <CustomButton
            type="button"
            onClick={handleOpenCreate}
            className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold"
          >
            <Plus size={18} />
            Add Brand
          </CustomButton>
        }
      />

      <div className="surface-card flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-standard ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm'
                    : 'text-[var(--color-gray-600)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-900)]'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isActive
                      ? 'bg-white text-[var(--color-primary)]'
                      : 'bg-[var(--surface-muted)] text-[var(--color-gray-500)]'
                  }`}
                >
                  {getTabCount(tab)}
                </span>
              </button>
            );
          })}
        </div>

        <CustomSearchBar
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full min-w-0 sm:max-w-[320px]"
        />
      </div>

      <div className="min-h-0 flex-1">
        <BrandTable
          brands={filteredBrands}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteBrand}
        />
      </div>

      <BrandDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        brand={editingBrand}
        onClose={handleCloseDrawer}
        onSave={handleSaveBrand}
      />
    </div>
  );
};

export default BrandList;
