import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Download,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Star,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CreateCustomerModal from '../../../components/custom/CreateCustomerModal';
import CustomTable, { CustomTableFooter } from '../../../components/custom/CustomTable';
import { useCustomerContext } from '../../../context/CustomerContext';

const CUSTOMER_TABS = ['All', 'VIP Plus', 'VIP', 'Active', 'Inactive'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const CustomerStatusBadge = ({ status }) => {
  const styles = {
    'VIP Plus': 'bg-[#F4E8FF] text-[#7C3AED]',
    VIP: 'bg-[#EEF4FF] text-[#2563EB]',
    Active: 'bg-[#E8FFF3] text-[#17C653]',
    Inactive: 'bg-[#F5F5F5] text-[#7E8299]',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || 'bg-[#F5F5F5] text-[#7E8299]'
      }`}
    >
      {status}
    </span>
  );
};

const InsightCard = ({ icon: Icon, label, value, toneClassName }) => (
  <div className="surface-card p-5 transition-standard hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-400)]">{label}</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-gray-900)]">{value}</p>
      </div>
      <div className={`rounded-2xl p-3 ${toneClassName}`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
);

const DetailStat = ({ label, value }) => (
  <div className="rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-400)]">{label}</p>
    <p className="mt-2 text-sm font-semibold text-[var(--color-gray-900)]">{value}</p>
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-[var(--table-grid)] bg-white px-4 py-3">
    <div className="rounded-xl bg-[var(--color-primary-light)] p-2 text-[var(--color-primary)]">
      <Icon size={16} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-400)]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[var(--color-gray-900)]">{value || 'Not provided'}</p>
    </div>
  </div>
);

const CustomerDetailDrawer = ({ customer, onClose, onEdit, onDelete }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[65] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="border-b border-[var(--table-grid)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-400)]">
                Customer Profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-gray-900)]">
                {customer.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[var(--table-grid)] bg-[var(--color-primary-light)] text-lg font-bold uppercase text-[var(--color-primary)]">
              {getInitials(customer.name)}
            </div>
            <div>
              <CustomerStatusBadge status={customer.status} />
              <p className="mt-2 text-sm text-[var(--color-gray-500)]">
                Joined {customer.joined} | Source: {customer.segment}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CustomButton type="button" onClick={() => onEdit(customer)} className="h-11 rounded-xl px-4">
              <Edit3 size={16} />
              Edit Customer
            </CustomButton>
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => onDelete(customer)}
              className="h-11 rounded-xl px-4 text-[var(--color-danger)] hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
            >
              <Trash2 size={16} />
              Delete
            </CustomButton>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-[var(--surface-muted)] p-6 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            <DetailStat label="Orders" value={customer.orders} />
            <DetailStat label="Total Spend" value={formatCurrency(customer.spent)} />
            <DetailStat label="Last Order" value={customer.lastOrder} />
            <DetailStat label="Tier" value={customer.status} />
          </div>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-gray-900)]">Contact Details</h3>
            <div className="mt-3 space-y-3">
              <DetailRow icon={Mail} label="Email" value={customer.email} />
              <DetailRow icon={Phone} label="Phone" value={customer.phone} />
              <DetailRow icon={MapPin} label="Location" value={customer.location} />
              <DetailRow icon={Calendar} label="Joined" value={customer.joined} />
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--table-grid)] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-gray-900)]">Customer Notes</h3>
                <p className="mt-1 text-sm text-[var(--color-gray-500)]">
                  Team context for conversations, campaigns, and support handoffs.
                </p>
              </div>
              <Star size={18} className="text-[#C99800]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--color-gray-700)]">
              {customer.notes || 'No notes added yet for this customer.'}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
};

const CustomerList = () => {
  const { customers, deleteCustomer } = useCustomerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [detailCustomerId, setDetailCustomerId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === detailCustomerId) || null,
    [customers, detailCustomerId],
  );

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return customers.filter((customer) => {
      const matchesTab = activeTab === 'All' || customer.status === activeTab;
      const matchesSearch =
        customer.name.toLowerCase().includes(normalizedQuery) ||
        customer.email.toLowerCase().includes(normalizedQuery) ||
        customer.status.toLowerCase().includes(normalizedQuery) ||
        customer.phone.toLowerCase().includes(normalizedQuery) ||
        customer.location.toLowerCase().includes(normalizedQuery) ||
        customer.segment.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, customers, searchQuery]);

  const customerInsights = useMemo(() => {
    const vipCustomers = customers.filter((customer) => customer.status.includes('VIP')).length;
    const repeatCustomers = customers.filter((customer) => customer.orders >= 5).length;
    const totalSpend = customers.reduce((sum, customer) => sum + customer.spent, 0);

    return {
      totalCustomers: customers.length,
      vipCustomers,
      averageSpend: customers.length ? formatCurrency(totalSpend / customers.length) : formatCurrency(0),
      repeatCustomers,
    };
  }, [customers]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customer) => {
    if (!window.confirm(`Delete customer "${customer.name}"?`)) {
      return;
    }

    deleteCustomer(customer.id);

    if (detailCustomerId === customer.id) {
      setDetailCustomerId(null);
    }

    if (editingCustomer?.id === customer.id) {
      handleCloseModal();
    }
  };

  const handleExportCustomers = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Status', 'Source', 'Orders', 'Total Spend', 'Joined'];
    const rows = filteredCustomers.map((customer) => [
      customer.name,
      customer.email,
      customer.phone,
      customer.location,
      customer.status,
      customer.segment,
      customer.orders,
      customer.spent,
      customer.joined,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalog-customers.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: 'Customer Profile',
      key: 'name',
      width: '32%',
      render: (value, row) => (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--table-grid)] bg-[var(--color-primary-light)] text-sm font-bold uppercase text-[var(--color-primary)]">
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[var(--color-gray-900)]">{value}</p>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--table-subtext)]">
              <Mail size={12} />
              {row.email}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[var(--table-subtext)]">
              <MapPin size={12} />
              {row.location || 'Location pending'}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (value) => <CustomerStatusBadge status={value} />,
    },
    {
      header: 'Orders',
      key: 'orders',
      render: (value) => <span className="font-semibold text-[var(--color-gray-900)]">{value}</span>,
    },
    {
      header: 'Total Spend',
      key: 'spent',
      render: (value) => (
        <span className="font-semibold text-[var(--color-gray-900)]">{formatCurrency(value)}</span>
      ),
    },
    {
      header: 'Source',
      key: 'segment',
      render: (value) => (
        <span className="inline-flex rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--color-gray-700)]">
          {value}
        </span>
      ),
    },
    { header: 'Last Order', key: 'lastOrder' },
  ];

  const actions = (customer) => (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        title="View customer"
        onClick={() => setDetailCustomerId(customer.id)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Eye size={18} />
      </button>
      <button
        type="button"
        title="Edit customer"
        onClick={() => handleOpenEdit(customer)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
      >
        <Edit3 size={18} />
      </button>
      <button
        type="button"
        title="Delete customer"
        onClick={() => handleDeleteCustomer(customer)}
        className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-gray-900)]">Customer Directory</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-gray-500)]">
            Keep outreach, loyalty, and support context in one place for the full team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CustomButton
            type="button"
            variant="outline"
            onClick={handleExportCustomers}
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
            <UserPlus size={18} />
            Add Customer
          </CustomButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          icon={Users}
          label="Total Customers"
          value={customerInsights.totalCustomers}
          toneClassName="bg-[var(--color-primary-light)] text-[var(--color-primary)]"
        />
        <InsightCard
          icon={Star}
          label="VIP Members"
          value={customerInsights.vipCustomers}
          toneClassName="bg-[#FFF8DD] text-[#C99800]"
        />
        <InsightCard
          icon={ShoppingCart}
          label="Repeat Buyers"
          value={customerInsights.repeatCustomers}
          toneClassName="bg-[#E8FFF3] text-[#17C653]"
        />
        <InsightCard
          icon={Download}
          label="Average Spend"
          value={customerInsights.averageSpend}
          toneClassName="bg-[#EEF4FF] text-[#2563EB]"
        />
      </div>

      <CustomTable
        columns={columns}
        data={paginatedCustomers}
        tabs={CUSTOMER_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getTabCount={(tab) =>
          customers.filter((customer) => tab === 'All' || customer.status === tab).length
        }
        actions={actions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRowClick={(customer) => setDetailCustomerId(customer.id)}
        showFilters={false}
        bodyMaxHeight="520px"
        tableClassName="text-[13px]"
        emptyTitle="No customers found"
        emptyDescription="Try a different name, email address, status, location, or source."
        footer={
          <CustomTableFooter
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            summary={`Showing ${filteredCustomers.length === 0 ? 0 : startIndex + 1} - ${Math.min(
              filteredCustomers.length,
              startIndex + paginatedCustomers.length,
            )} of ${filteredCustomers.length} customers`}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
      />

      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={editingCustomer}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        onClose={() => setDetailCustomerId(null)}
        onEdit={(customer) => {
          setDetailCustomerId(null);
          handleOpenEdit(customer);
        }}
        onDelete={handleDeleteCustomer}
      />
    </div>
  );
};

export default CustomerList;
