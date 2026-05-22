import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import { useCategoryContext } from '../../../context/CategoryContext';
import SubcategoryDrawer from '../components/SubcategoryDrawer';
import SubcategoryTable from '../components/SubcategoryTable';

const SubcategoryList = () => {
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

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-5 overflow-hidden animate-in fade-in duration-700">
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-gray-900)]">Subcategories</h1>
        </div>

        <CustomButton
          type="button"
          onClick={handleOpenCreate}
          className="h-11 rounded-xl px-5 normal-case tracking-normal text-sm font-semibold"
        >
          <Plus size={18} />
          Add Subcategory
        </CustomButton>
      </div>

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
