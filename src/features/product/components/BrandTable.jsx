import React from 'react';
import { Edit3, Eye, Trash2 } from 'lucide-react';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import StatusBadge from '../../../components/custom/StatusBadge';

const BrandLogo = ({ brand }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-white p-2">
      {brand.logo ? (
        <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
      ) : (
        <span className="text-lg font-bold text-[var(--color-primary)]">{brand.name.slice(0, 1)}</span>
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-[var(--color-gray-900)]">{brand.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-[var(--table-subtext)]">{brand.description}</p>
    </div>
  </div>
);

const BrandTable = ({
  brands,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.max(1, Math.ceil(brands.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleBrands = brands.slice(startIndex, startIndex + rowsPerPage);

  const columns = [
    {
      header: 'Brand',
      key: 'name',
      width: '36%',
      render: (_, brand) => <BrandLogo brand={brand} />,
    },
    {
      header: 'Description',
      key: 'description',
      render: (value) => <p className="line-clamp-2 max-w-[320px] text-sm text-[var(--table-text)]">{value}</p>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const actions = (brand) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        title="View brand"
        onClick={() => onView(brand)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Eye size={17} />
      </button>
      <button
        type="button"
        title="Edit brand"
        onClick={() => onEdit(brand)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={17} />
      </button>
      <button
        type="button"
        title="Delete brand"
        onClick={() => onDelete(brand)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  return (
    <CustomTable
      columns={columns}
      data={visibleBrands}
      actions={actions}
      showFilters={false}
      fillHeight
      emptyTitle="No brands found"
      emptyDescription="Try a different search term or add a new brand to the catalog."
      footer={
        <CustomTableFooter
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          summary={`Showing ${brands.length === 0 ? 0 : startIndex + 1} - ${Math.min(brands.length, startIndex + visibleBrands.length)} of ${brands.length} brands`}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      }
    />
  );
};

export default BrandTable;
