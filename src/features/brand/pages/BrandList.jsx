import React, { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
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

  const handleExportBrands = () => {
    const headers = ['Name', 'Description', 'Status'];
    const rows = filteredBrands.map((brand) => [brand.name, brand.description, brand.status]);

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
    link.download = 'brands.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-3 overflow-hidden animate-in fade-in duration-700">
      <PageHeader
        title="Brand List"
        description="Track brand status and quick actions from one responsive table."
        backLabel="Back to Dashboard"
        onBack={() => navigate('/')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleExportBrands}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              <Download size={16} />
              Export
            </CustomButton>
            <CustomButton
              type="button"
              onClick={handleOpenCreate}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              <Plus size={18} />
              Add Brand
            </CustomButton>
          </>
        }
      />

      <div className="min-h-0 flex-1">
        <BrandTable
          brands={filteredBrands}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getTabCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
