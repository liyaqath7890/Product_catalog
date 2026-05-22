import React from 'react';
import { Edit3, Power, Trash2 } from 'lucide-react';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import StatusBadge from '../../../components/custom/StatusBadge';

const SubcategoryTable = ({
  subcategories,
  tabs,
  activeTab,
  onTabChange,
  getTabCount,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const totalPages = Math.max(1, Math.ceil(subcategories.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleSubcategories = subcategories.slice(startIndex, startIndex + rowsPerPage);

  const columns = [
    {
      header: 'Subcategory',
      key: 'name',
      width: '30%',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-white">
            {row.image ? (
              <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[var(--color-primary)]">{row.name.slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-gray-900)]">{value}</p>
            <p className="mt-1 line-clamp-2 text-xs text-[var(--table-subtext)]">{row.description || 'No description added'}</p>
          </div>
        </div>
      ),
    },
    { header: 'Parent Category', key: 'categoryName' },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (subcategory) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        title={subcategory.status === 'Active' ? 'Deactivate subcategory' : 'Activate subcategory'}
        onClick={() => onToggleStatus(subcategory.id)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Power size={17} />
      </button>
      <button
        type="button"
        title="Edit subcategory"
        onClick={() => onEdit(subcategory)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={17} />
      </button>
      <button
        type="button"
        title="Delete subcategory"
        onClick={() => onDelete(subcategory)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  return (
    <CustomTable
      columns={columns}
      data={visibleSubcategories}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      getTabCount={getTabCount}
      showFilters={false}
      fillHeight
      actions={actions}
      toolbarActions={
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
          className="h-11 min-w-[220px] rounded-xl border border-[var(--color-gray-200)] bg-white px-4 text-sm font-semibold text-[var(--table-text)] outline-none"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      }
      emptyTitle="No subcategories found"
      emptyDescription="Try a different status or category filter, or add a new subcategory."
      footer={
        <CustomTableFooter
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          summary={`Showing ${subcategories.length === 0 ? 0 : startIndex + 1} - ${Math.min(subcategories.length, startIndex + visibleSubcategories.length)} of ${subcategories.length} subcategories`}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      }
    />
  );
};

export default SubcategoryTable;
