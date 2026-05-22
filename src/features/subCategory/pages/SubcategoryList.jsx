import React, { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import { useCategoryContext } from '../../../context/CategoryContext';
import PageHeader from '../../../components/layout/PageHeader';
import SubcategoryDrawer from '../components/SubcategoryDrawer';
import SubcategoryTable from '../components/SubcategoryTable';

const SubcategoryList = () => {
  const navigate = useNavigate();
  const {
    categories,
    subcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    toggleSubcategoryStatus,
  } = useCategoryContext();
  const [activeTab, setActiveTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const tabs = ['All', 'Active', 'Inactive'];

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.name, value: String(category.id) })),
    [categories],
  );

  const filteredSubcategories = useMemo(
    () =>
      subcategories.filter((subcategory) => {
        const matchesTab = activeTab === 'All' || subcategory.status === activeTab;
        const matchesCategory = !categoryFilter || String(subcategory.categoryId) === String(categoryFilter);

        return matchesTab && matchesCategory;
      }),
    [activeTab, categoryFilter, subcategories],
  );

  const getTabCount = (tab) =>
    subcategories.filter((subcategory) => tab === 'All' || subcategory.status === tab).length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, categoryFilter]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredSubcategories.length / rowsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredSubcategories.length, rowsPerPage]);

  const handleOpenCreate = () => {
    setEditingSubcategory(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setEditingSubcategory(null);
    setIsDrawerOpen(false);
  };

  const handleSaveSubcategory = (subcategory) => {
    if (editingSubcategory) {
      updateSubcategory({ ...subcategory, id: editingSubcategory.id });
    } else {
      addSubcategory(subcategory);
    }

    handleCloseDrawer();
  };

  const handleDeleteSubcategory = (subcategory) => {
    if (!window.confirm(`Delete "${subcategory.name}" from the subcategory list?`)) {
      return;
    }

    deleteSubcategory(subcategory.id);
  };

  const handleToggleStatus = (subcategoryId) => {
    toggleSubcategoryStatus(subcategoryId);
  };

  const handleExportSubcategories = () => {
    const headers = ['Subcategory', 'Parent Category', 'Description', 'Status'];
    const rows = filteredSubcategories.map((subcategory) => [
      subcategory.name,
      subcategory.categoryName,
      subcategory.description,
      subcategory.status,
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
    link.download = 'subcategories.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl animate-in flex-col gap-3 overflow-hidden fade-in duration-700">
      <PageHeader
        title="Subcategories"
        description="Track subcategory status, parent category, and quick actions from one responsive table."
        backLabel="Back to Categories"
        onBack={() => navigate('/categories')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleExportSubcategories}
              className="h-10 rounded-xl px-4 text-[12px] font-semibold normal-case tracking-normal"
            >
              <Download size={16} />
              Export
            </CustomButton>
            <CustomButton
              type="button"
              onClick={handleOpenCreate}
              className="h-10 rounded-xl px-4 text-[12px] font-semibold normal-case tracking-normal"
            >
              <Plus size={18} />
              Add Subcategory
            </CustomButton>
          </>
        }
      />

      <div className="min-h-0 flex-1">
        <SubcategoryTable
          subcategories={filteredSubcategories}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getTabCount}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categoryOptions={categoryOptions}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteSubcategory}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <SubcategoryDrawer
        isOpen={isDrawerOpen}
        categories={categories}
        mode={editingSubcategory ? 'edit' : 'create'}
        subcategory={editingSubcategory}
        onClose={handleCloseDrawer}
        onSave={handleSaveSubcategory}
      />
    </div>
  );
};

export default SubcategoryList;
