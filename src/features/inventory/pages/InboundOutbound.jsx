import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock3,
  Package,
  Plus,
  User,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import PageHeader from '../../../components/layout/PageHeader';
import { useToast } from '../../../components/feedback/ToastProvider';

const formatDate = (value = new Date()) =>
  value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (value = new Date()) =>
  value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const INITIAL_TRANSACTIONS = [
  { id: 'TX-1001', type: 'Inbound', product: 'MacBook Pro 14"', quantity: 20, supplier: 'Apple Inc.', status: 'Completed', date: '25 Mar, 2025' },
  { id: 'TX-1002', type: 'Outbound', product: 'iPhone 15 Pro', quantity: 5, supplier: 'Direct Sale', status: 'Shipped', date: '24 Mar, 2025' },
  { id: 'TX-1003', type: 'Inbound', product: 'Sony WH-XM5', quantity: 50, supplier: 'Sony Electronics', status: 'Pending', date: '24 Mar, 2025' },
  { id: 'TX-1004', type: 'Outbound', product: 'Apple Watch Ultra', quantity: 2, supplier: 'Direct Sale', status: 'Pending', date: '23 Mar, 2025' },
  { id: 'TX-1005', type: 'Inbound', product: 'Galaxy S24 Ultra', quantity: 15, supplier: 'Samsung Global', status: 'Cancelled', date: '22 Mar, 2025' },
];

const DrawerShell = ({ isOpen, title, subtitle, onClose, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-[460px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="border-b border-[var(--table-grid)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">{title}</h2>
              {subtitle ? <p className="mt-1 text-sm text-[var(--color-gray-500)]">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto bg-[var(--surface-muted)] px-6 py-6">{children}</div>
        {footer ? <div className="border-t border-[var(--table-grid)] bg-white px-6 py-4">{footer}</div> : null}
      </aside>
    </div>
  );
};

const InboundOutbound = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [auditLog, setAuditLog] = useState([
    { id: 1, action: 'Seed data loaded', detail: 'Initial transaction history is ready.', time: 'Today, 09:00' },
  ]);
  const [formValues, setFormValues] = useState({
    type: 'Inbound',
    product: '',
    quantity: '',
    supplier: '',
    status: 'Pending',
  });

  const inboundTotal = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'Inbound').reduce((sum, transaction) => sum + transaction.quantity, 0),
    [transactions],
  );
  const outboundTotal = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'Outbound').reduce((sum, transaction) => sum + transaction.quantity, 0),
    [transactions],
  );
  const pendingCount = transactions.filter((transaction) => transaction.status === 'Pending').length;
  const completedCount = transactions.filter((transaction) => transaction.status === 'Completed').length;

  const openAuditLog = () => setIsAuditOpen(true);
  const openTransaction = () => {
    setFormValues({
      type: 'Inbound',
      product: '',
      quantity: '',
      supplier: '',
      status: 'Pending',
    });
    setIsTransactionOpen(true);
  };

  const closeTransaction = () => setIsTransactionOpen(false);

  const handleSaveTransaction = (event) => {
    event.preventDefault();

    if (!formValues.product.trim() || !formValues.quantity || !formValues.supplier.trim()) {
      window.alert('Please fill in product, quantity, and supplier.');
      return;
    }

    const nextTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: formValues.type,
      product: formValues.product.trim(),
      quantity: Number(formValues.quantity),
      supplier: formValues.supplier.trim(),
      status: formValues.status,
      date: formatDate(),
    };

    setTransactions((current) => [nextTransaction, ...current]);
    setAuditLog((current) => [
      {
        id: Date.now(),
        action: 'Transaction created',
        detail: `${nextTransaction.type} for ${nextTransaction.product} was added.`,
        time: `${formatDate()} ${formatTime()}`,
      },
      ...current,
    ]);
    success('Transaction added', `${nextTransaction.product} was saved successfully.`);
    setIsTransactionOpen(false);
  };

  const auditItems = useMemo(
    () => [
      ...auditLog,
      ...transactions.slice(0, 5).map((transaction) => ({
        id: transaction.id,
        action: transaction.type === 'Inbound' ? 'Inbound recorded' : 'Outbound recorded',
        detail: `${transaction.product} · ${transaction.quantity} units · ${transaction.status}`,
        time: transaction.date,
      })),
    ],
    [auditLog, transactions],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-in fade-in duration-700">
      <PageHeader
        title="Inbound & Outbound"
        description="Track stock movement, log new transactions, and review the latest audit trail."
        backLabel="Back to Inventory"
        onBack={() => navigate('/inventory')}
        actions={
          <>
            <CustomButton type="button" variant="outline" onClick={openAuditLog} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold">
              Audit Log
            </CustomButton>
            <CustomButton type="button" onClick={openTransaction} className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold">
              <Plus size={18} />
              New Transaction
            </CustomButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-3xl border border-[var(--table-grid)] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-[var(--color-primary)]">
              <ArrowDownRight size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Inbound Summary</h3>
            </div>
            <p className="mb-2 text-4xl font-black tracking-tighter text-[var(--color-gray-900)]">{inboundTotal} Units</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-gray-400)]">Received this month</p>
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full w-[65%] bg-[var(--color-primary)]" />
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--table-grid)] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-blue-600">
              <ArrowUpRight size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Outbound Summary</h3>
            </div>
            <p className="mb-2 text-4xl font-black tracking-tighter text-[var(--color-gray-900)]">{outboundTotal} Units</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-gray-400)]">Shipped this month</p>
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full w-[45%] bg-blue-500" />
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--table-grid)] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-emerald-600">
              <Clock3 size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Live Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">Pending</p>
                <p className="mt-2 text-2xl font-black text-[var(--color-gray-900)]">{pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">Completed</p>
                <p className="mt-2 text-2xl font-black text-[var(--color-gray-900)]">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="h-full overflow-hidden rounded-3xl border border-[var(--table-grid)] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-6 py-5">
              <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-gray-400)]">Recent Transactions</h4>
              <button
                type="button"
                onClick={openAuditLog}
                className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-active)]"
              >
                View Audit Log
              </button>
            </div>
            <div className="divide-y divide-[var(--table-grid)]">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex cursor-pointer flex-col justify-between gap-6 p-6 transition-colors hover:bg-[var(--surface-muted)]/60 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${tx.type === 'Inbound' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                      {tx.type === 'Inbound' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black tracking-tight text-[var(--color-gray-900)]">{tx.product}</h5>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--color-gray-400)]">
                        <span className="flex items-center gap-1.5">
                          <Package size={12} />
                          {tx.quantity} Units
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                        <span className="flex items-center gap-1.5">
                          <User size={12} />
                          {tx.supplier}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {tx.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : tx.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DrawerShell
        isOpen={isAuditOpen}
        title="Audit Log"
        subtitle="Review transaction history and operational changes."
        onClose={() => setIsAuditOpen(false)}
      >
        <div className="space-y-3">
          {auditItems.map((item) => (
            <div key={`${item.id}-${item.time}`} className="rounded-2xl border border-[var(--table-grid)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--color-gray-900)]">{item.action}</p>
              <p className="mt-1 text-sm text-[var(--color-gray-500)]">{item.detail}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-gray-400)]">{item.time}</p>
            </div>
          ))}
        </div>
      </DrawerShell>

      <DrawerShell
        isOpen={isTransactionOpen}
        title="New Transaction"
        subtitle="Create an inbound or outbound stock movement."
        onClose={closeTransaction}
        footer={
          <div className="flex items-center justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={closeTransaction} className="h-11 rounded-xl px-5">
              Cancel
            </CustomButton>
            <CustomButton type="submit" form="new-transaction-form" className="h-11 rounded-xl px-5">
              Save Transaction
            </CustomButton>
          </div>
        }
      >
        <form id="new-transaction-form" onSubmit={handleSaveTransaction} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Type</span>
            <select className="control-shell w-full px-4 py-3 text-sm" value={formValues.type} onChange={(event) => setFormValues((current) => ({ ...current, type: event.target.value }))}>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Product</span>
            <input className="control-shell w-full px-4 py-3 text-sm" value={formValues.product} onChange={(event) => setFormValues((current) => ({ ...current, product: event.target.value }))} placeholder="Product name" />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Quantity</span>
              <input className="control-shell w-full px-4 py-3 text-sm" type="number" min="1" value={formValues.quantity} onChange={(event) => setFormValues((current) => ({ ...current, quantity: event.target.value }))} placeholder="0" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Status</span>
              <select className="control-shell w-full px-4 py-3 text-sm" value={formValues.status} onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">Supplier / Customer</span>
            <input className="control-shell w-full px-4 py-3 text-sm" value={formValues.supplier} onChange={(event) => setFormValues((current) => ({ ...current, supplier: event.target.value }))} placeholder="Supplier name or sale source" />
          </label>
        </form>
      </DrawerShell>
    </div>
  );
};

export default InboundOutbound;
