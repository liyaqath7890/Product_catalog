import React from 'react';
import { Edit3, Eye, Trash2 } from 'lucide-react';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import StatusBadge from '../../../components/custom/StatusBadge';

const UnitTable = ({
  units,
  tabs,
  activeTab,
  onTabChange,
  getTabCount,
  searchQuery,
  onSearchChange,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.max(1, Math.ceil(units.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleUnits = units.slice(startIndex, startIndex + rowsPerPage);

  const columns = [
    {
      header: 'Unit',
      key: 'name',
      width: '34%',
      render: (value) => <span className="text-sm font-semibold text-[var(--color-gray-900)]">{value}</span>,
    },
    { header: 'Code', key: 'shortCode' },
    { header: 'Used In', key: 'usedIn' },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (unit) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        title="View unit"
        onClick={() => onView(unit)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Eye size={18} />
      </button>
      <button
        type="button"
        title="Edit unit"
        onClick={() => onEdit(unit)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={18} />
      </button>
      <button
        type="button"
        title="Delete unit"
        onClick={() => onDelete(unit)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <CustomTable
      columns={columns}
      data={visibleUnits}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      getTabCount={getTabCount}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      actions={actions}
      showFilters={false}
      fillHeight
      emptyTitle="No units found"
      emptyDescription="Try a different search term or add a new unit to the catalog."
      footer={
        <CustomTableFooter
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          summary={`Showing ${units.length === 0 ? 0 : startIndex + 1} - ${Math.min(units.length, startIndex + visibleUnits.length)} of ${units.length} units`}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      }
    />
  );
};

export default UnitTable;
