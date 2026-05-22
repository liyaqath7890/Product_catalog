import React, { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import { useToast } from '../../../components/feedback/ToastProvider';
import PageHeader from '../../../components/layout/PageHeader';
import UnitDrawer from '../components/UnitDrawer';
import UnitTable from '../components/UnitTable';
import { generateUnitCode } from '../utils/unitCodeUtils';

const INITIAL_UNITS = [
  {
    id: 1,
    name: 'Piece',
    shortCode: generateUnitCode('Piece'),
    usedIn: 'General',
    description: 'Used for single items such as accessories and standalone catalog products.',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Pair',
    shortCode: generateUnitCode('Pair'),
    usedIn: 'Shoes',
    description: 'Standard unit for footwear and bundled two-item products.',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bottle',
    shortCode: generateUnitCode('Bottle'),
    usedIn: 'Beauty',
    description: 'Applied to liquids, serums, toners, and packaged cosmetics.',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Box',
    shortCode: generateUnitCode('Box'),
    usedIn: 'Accessories',
    description: 'Used when products are sold in a retail or multi-item box format.',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Set',
    shortCode: generateUnitCode('Set'),
    usedIn: 'Fashion',
    description: 'Used for grouped items like coordinated apparel or bundled skincare sets.',
    status: 'Inactive',
  },
];

const UnitList = () => {
  const { success } = useToast();
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [drawerMode, setDrawerMode] = useState('create');

  const tabs = ['All', 'Active', 'Inactive'];

  const filteredUnits = useMemo(
    () =>
      units.filter((unit) => {
        const query = searchQuery.toLowerCase();
        const matchesTab = activeTab === 'All' || unit.status === activeTab;
        const matchesSearch =
          unit.name.toLowerCase().includes(query) ||
          unit.shortCode.toLowerCase().includes(query) ||
          unit.usedIn.toLowerCase().includes(query) ||
          unit.description.toLowerCase().includes(query) ||
          unit.status.toLowerCase().includes(query);

        return matchesTab && matchesSearch;
      }),
    [activeTab, searchQuery, units],
  );

  const getTabCount = (tab) => units.filter((unit) => tab === 'All' || unit.status === tab).length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, searchQuery]);

  React.useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUnits.length / rowsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredUnits.length, rowsPerPage]);

  const handleOpenCreate = () => {
    setEditingUnit(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (unit) => {
    setEditingUnit(unit);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setEditingUnit(null);
    setIsDrawerOpen(false);
    setDrawerMode('create');
  };

  const handleSaveUnit = (unit) => {
    const nextUnit = { ...unit, shortCode: generateUnitCode(unit.name) };

    if (editingUnit) {
      setUnits((current) =>
        current.map((item) => (item.id === editingUnit.id ? { ...item, ...nextUnit, id: editingUnit.id } : item)),
      );
      success('Unit updated', `${unit.name} changes were saved.`);
    } else {
      setUnits((current) => [{ ...nextUnit, id: Date.now() }, ...current]);
      success('Unit added', `${unit.name} was added successfully.`);
    }

    handleCloseDrawer();
  };

  const handleDeleteUnit = (unit) => {
    if (!window.confirm(`Delete "${unit.name}" from the unit list?`)) {
      return;
    }

    setUnits((current) => current.filter((item) => item.id !== unit.id));
    success('Unit deleted', `${unit.name} was removed from the unit list.`);
  };

  const handleExportUnits = () => {
    const headers = ['Name', 'Code', 'Used In', 'Description', 'Status'];
    const rows = filteredUnits.map((unit) => [unit.name, unit.shortCode, unit.usedIn, unit.description, unit.status]);

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
    link.download = 'units.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col gap-5 overflow-hidden animate-in fade-in duration-700">
      <PageHeader
        title="Units"
        description="Keep unit names, codes, and catalog usage easy to scan."
        backLabel="Back to Dashboard"
        onBack={() => window.location.assign('/')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleExportUnits}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-[12px] font-semibold"
            >
              <Download size={16} />
              Export
            </CustomButton>
            <CustomButton
              type="button"
              onClick={handleOpenCreate}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-[12px] font-semibold"
            >
              <Plus size={18} />
              Add Unit
            </CustomButton>
          </>
        }
      />

      <div className="min-h-0 flex-1">
        <UnitTable
          units={filteredUnits}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getTabCount={getTabCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteUnit}
        />
      </div>

      <UnitDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        unit={editingUnit}
        onClose={handleCloseDrawer}
        onSave={handleSaveUnit}
      />
    </div>
  );
};

export default UnitList;
