import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const normalized = status?.toLowerCase();
  const meta = {
    live: {
      label: 'Live',
      className: 'bg-[#E8FFF3] text-[#17C653] border-[#D9FBE6]',
    },
    active: {
      label: 'Active',
      className: 'bg-[#E8FFF3] text-[#17C653] border-[#D9FBE6]',
    },
    draft: {
      label: 'Draft',
      className: 'bg-[#FFF8DD] text-[#C99800] border-[#F6E7A6]',
    },
    scheduled: {
      label: 'Scheduled',
      className: 'bg-[#FFF8DD] text-[#C99800] border-[#F6E7A6]',
    },
    archived: {
      label: 'Archived',
      className: 'bg-[#F8F5FF] text-[#7239EA] border-[#E8DBFF]',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-[#FFF5F8] text-[#F1416C] border-[#FFD9E3]',
    },
    'action needed': {
      label: 'Action Needed',
      className: 'bg-[#FFF5F8] text-[#F1416C] border-[#FFD9E3]',
    },
    'must act': {
      label: 'Must Act',
      className: 'bg-[#FFF5F8] text-[#F1416C] border-[#FFD9E3]',
    },
  }[normalized] || {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  return (
    <span
      title={meta.label}
      aria-label={meta.label}
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none transition-standard ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  );
};

export default StatusBadge;
