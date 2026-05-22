import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Layers,
  MoreVertical,
} from 'lucide-react';
import CustomSearchBar from './CustomSearchBar';
import CustomButton from './CustomButton';

const normalizeTabs = (tabs) =>
  tabs.map((tab) => (typeof tab === 'string' ? { key: tab, label: tab } : tab));

const CustomTable = ({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  actions = null,
  tabs = [],
  activeTab = '',
  onTabChange,
  getTabCount,
  searchQuery = '',
  onSearchChange,
  showFilters = true,
  onFilterClick,
  filterLabel = 'Filters',
  title,
  subtitle,
  headerStart,
  toolbarActions,
  footer,
  emptyTitle = 'No matching records found',
  emptyDescription,
  actionsHeaderLabel = 'Action',
  minWidth = 960,
  rowKey = 'id',
  containerClassName = '',
  tableClassName = '',
  bodyMaxHeight,
  stickyHeader = true,
  fillHeight = false,
}) => {
  const normalizedTabs = normalizeTabs(tabs);
  const hasToolbar =
    normalizedTabs.length > 0 ||
    onSearchChange !== undefined ||
    headerStart ||
    title ||
    toolbarActions ||
    showFilters;
  const combinePrimaryToolbar = normalizedTabs.length === 0 && (title || toolbarActions);
  const showPrimaryToolbarRow = headerStart || title || (toolbarActions && normalizedTabs.length === 0);

  return (
    <div
      className={`surface-card overflow-hidden animate-in fade-in duration-500 ${
        fillHeight ? 'flex h-full min-h-0 flex-col' : ''
      } ${containerClassName}`}
    >
      {hasToolbar ? (
        <div className="border-b border-[var(--table-grid)] bg-white">
          {showPrimaryToolbarRow ? (
            <div
              className={`flex flex-col gap-3 px-5 py-3.5 ${
                combinePrimaryToolbar
                  ? 'lg:flex-row lg:items-center lg:justify-between'
                  : 'md:flex-row md:items-center md:justify-between'
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                {headerStart ? <div className="shrink-0 pt-0.5">{headerStart}</div> : null}
                {title || subtitle ? (
                  <div className="min-w-0 space-y-1">
                    {title ? <h2 className="text-lg font-semibold tracking-tight text-[var(--color-gray-900)]">{title}</h2> : null}
                    {subtitle ? <p className="max-w-2xl text-sm leading-6 text-[var(--color-gray-500)]">{subtitle}</p> : null}
                  </div>
                ) : null}
              </div>
              {combinePrimaryToolbar ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                  {onSearchChange !== undefined ? (
                    <CustomSearchBar
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(event) => onSearchChange(event.target.value)}
                      className="min-w-[240px]"
                    />
                  ) : null}
                  {toolbarActions ? <div className="flex flex-wrap items-center gap-3">{toolbarActions}</div> : null}
                  {showFilters ? (
                    <CustomButton
                      type="button"
                      variant="outline"
                      onClick={onFilterClick}
                      className="h-11 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
                    >
                      <Filter size={16} />
                      {filterLabel}
                    </CustomButton>
                  ) : null}
                </div>
              ) : toolbarActions ? <div className="flex flex-wrap items-center gap-3">{toolbarActions}</div> : null}
            </div>
          ) : null}

          {(normalizedTabs.length > 0 || ((!combinePrimaryToolbar && onSearchChange !== undefined) || (!combinePrimaryToolbar && showFilters))) && (
            <div className="flex flex-col gap-3 px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
              {normalizedTabs.length > 0 ? (
                <div className="flex min-w-0 items-center gap-2 overflow-x-auto no-scrollbar">
                  {normalizedTabs.map((tab) => {
                    const tabKey = tab.key ?? tab.label;
                    const isActive = activeTab === tabKey;

                    return (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() => onTabChange?.(tabKey)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-standard ${
                          isActive
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-gray-600)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-900)]'
                        }`}
                      >
                        <span>{tab.label ?? tabKey}</span>
                        {getTabCount ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              isActive
                                ? 'bg-white text-[var(--color-primary)]'
                                : 'bg-[var(--surface-muted)] text-[var(--color-gray-500)]'
                            }`}
                          >
                            {getTabCount(tabKey)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                {normalizedTabs.length > 0 && toolbarActions ? (
                  <div className="flex flex-wrap items-center gap-3">{toolbarActions}</div>
                ) : null}
                {!combinePrimaryToolbar && onSearchChange !== undefined ? (
                  <CustomSearchBar
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="min-w-[240px]"
                  />
                ) : null}
                {!combinePrimaryToolbar && showFilters ? (
                  <CustomButton
                    type="button"
                    variant="outline"
                    onClick={onFilterClick}
                    className="h-11 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
                  >
                    <Filter size={16} />
                    {filterLabel}
                  </CustomButton>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div
        className={`w-full overflow-auto custom-scrollbar ${fillHeight ? 'min-h-0 flex-1' : ''}`}
        style={bodyMaxHeight ? { maxHeight: bodyMaxHeight } : undefined}
      >
        <table className={`w-full border-collapse text-left ${tableClassName}`} style={{ minWidth }}>
          <thead className={`bg-[var(--color-primary-light)] ${stickyHeader ? 'sticky top-0 z-[1]' : ''}`}>
            <tr className="border-b border-[var(--table-grid)]">
              {selectable ? (
                <th className="w-14 border-r border-[var(--table-grid)] px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-[var(--color-gray-300)] accent-[var(--color-primary)]"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={(event) => onSelectAll?.(event.target.checked)}
                  />
                </th>
              ) : null}

              {columns.map((column, index) => (
                <th
                  key={column.key ?? index}
                  className={`border-r border-[var(--table-grid)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--table-head)] last:border-r-0 ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                  style={{ width: column.width }}
                >
                  <div
                    className={`flex items-center gap-2 ${column.align === 'right' ? 'justify-end' : ''} ${
                      column.sortable === false ? '' : 'cursor-pointer'
                    }`}
                  >
                    <span>{column.header}</span>
                    {column.sortable === false ? null : (
                      <div className="flex flex-col text-[var(--color-gray-400)]">
                        <ChevronUp size={10} className="-mb-0.5" />
                        <ChevronDown size={10} />
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {actions ? (
                <th className="w-20 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--table-head)]">
                  {actionsHeaderLabel}
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row[rowKey] ?? rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-[var(--table-grid)] transition-standard last:border-b-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-[var(--surface-muted)]/60' : ''
                } ${selectedRows.includes(row.id) ? 'bg-[var(--color-primary-light)]/35' : ''}`}
              >
                {selectable ? (
                  <td className="border-r border-[var(--table-grid)] px-3 py-3.5 text-center" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-[var(--color-gray-300)] accent-[var(--color-primary)]"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => onSelectRow?.(row.id)}
                    />
                  </td>
                ) : null}

                {columns.map((column, columnIndex) => (
                  <td
                  key={column.key ?? columnIndex}
                    className={`border-r border-[var(--table-grid)] px-4 py-3 align-middle text-[13px] text-[var(--table-text)] last:border-r-0 ${
                      column.align === 'right' ? 'text-right' : ''
                    } ${column.className || ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}

                {actions ? (
                  <td className="px-4 py-3 text-center" onClick={(event) => event.stopPropagation()}>
                    {typeof actions === 'function' ? (
                      actions(row)
                    ) : (
                      <button type="button" className="rounded-lg p-1.5 text-[var(--color-gray-400)] hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]">
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <Layers size={44} className="text-[var(--color-gray-300)]" />
          <p className="text-sm font-semibold text-[var(--color-gray-800)]">{emptyTitle}</p>
          {emptyDescription ? <p className="max-w-md text-sm text-[var(--color-gray-500)]">{emptyDescription}</p> : null}
        </div>
      ) : null}

      {footer ? (
        <div className="flex flex-col gap-4 border-t border-[var(--table-grid)] px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export const CustomTableFooter = ({
  summary,
  page = 1,
  totalPages = 1,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3 text-sm text-[var(--color-gray-600)] xl:w-auto">
        {typeof rowsPerPage !== 'undefined' ? (
          <label className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[13px]">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(event) => onRowsPerPageChange?.(Number(event.target.value))}
              className="rounded-lg border border-[var(--table-grid)] bg-white px-2 py-1 text-[13px] outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {summary ? <span className="text-[13px] leading-6">{summary}</span> : null}
      </div>

      <div className="flex w-full flex-wrap items-center justify-start gap-1 text-[13px] sm:justify-end xl:w-auto">
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg p-2 text-[var(--color-gray-500)] hover:bg-[var(--surface-muted)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange?.(item)}
            className={`h-9 w-9 rounded-lg font-semibold transition-standard ${
              item === page
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-gray-600)] hover:bg-[var(--surface-muted)]'
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg p-2 text-[var(--color-gray-500)] hover:bg-[var(--surface-muted)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
};

export default CustomTable;
