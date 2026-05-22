import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, Download, LineChart, Package, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../components/custom/CustomButton';
import PageHeader from '../../../components/layout/PageHeader';
import { useToast } from '../../../components/feedback/ToastProvider';

const INITIAL_RECOMMENDATIONS = [
  { id: 1, product: 'MacBook Pro 14"', current: 45, demand: 'High', recommended: 25, status: 'Critical' },
  { id: 2, product: 'iPhone 15 Pro', current: 124, demand: 'Steady', recommended: 0, status: 'Healthy' },
  { id: 3, product: 'Sony WH-XM5', current: 8, demand: 'Surging', recommended: 40, status: 'Low Stock' },
  { id: 4, product: 'iPad Air M2', current: 15, demand: 'Low', recommended: 0, status: 'Adequate' },
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

const toneForStatus = (status) => {
  if (status === 'Critical') return { color: 'text-rose-600', bg: 'bg-rose-50' };
  if (status === 'Low Stock') return { color: 'text-amber-600', bg: 'bg-amber-50' };
  if (status === 'Healthy') return { color: 'text-emerald-600', bg: 'bg-emerald-50' };
  return { color: 'text-blue-600', bg: 'bg-blue-50' };
};

const StockPlanner = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [forecastVersion, setForecastVersion] = useState(0);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditLog, setAuditLog] = useState([
    { id: 1, action: 'Planner loaded', detail: 'Initial stock recommendations are ready.', time: 'Today, 09:00' },
  ]);

  const runForecast = () => {
    const nextRecommendations = recommendations.map((item) => {
      const demandFactor = {
        Surging: 1.2,
        High: 0.9,
        Steady: 0.35,
        Low: 0.1,
      }[item.demand] ?? 0.25;

      const recommended = Math.max(0, Math.round(Math.max(10, 60 - item.current) * demandFactor));
      const status = recommended >= 30 ? 'Critical' : recommended >= 15 ? 'Low Stock' : recommended > 0 ? 'Adequate' : 'Healthy';
      return { ...item, recommended, status };
    });

    setRecommendations(nextRecommendations);
    setForecastVersion((current) => current + 1);
    setAuditLog((current) => [
      {
        id: Date.now(),
        action: 'Forecast run',
        detail: 'Recalculated replenishment recommendations from current stock and demand.',
        time: new Date().toLocaleString(),
      },
      ...current,
    ]);
    success('Forecast complete', 'Stock planner recommendations were refreshed.');
  };

  const auditItems = useMemo(
    () => [
      ...auditLog,
      ...recommendations.map((item) => ({
        id: item.id,
        action: 'Recommendation updated',
        detail: `${item.product} - ${item.recommended} suggested units`,
        time: `Forecast v${forecastVersion}`,
      })),
    ],
    [auditLog, forecastVersion, recommendations],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 animate-in fade-in duration-700">
      <PageHeader
        title="Stock Planner"
        description="Review demand signals, stock-out risk, and replenishment suggestions."
        backLabel="Back to Inventory"
        onBack={() => navigate('/inventory')}
        actions={
          <>
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setIsAuditOpen(true)}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              Audit Log
            </CustomButton>
            <CustomButton
              type="button"
              onClick={runForecast}
              className="h-10 rounded-xl px-4 normal-case tracking-normal text-sm font-semibold"
            >
              <Download size={16} />
              Run Forecast
            </CustomButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-[var(--table-grid)] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-[var(--color-primary)]">
              <LineChart size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Demand Forecast</h3>
            </div>
            <p className="mb-2 text-3xl font-black tracking-tighter text-[var(--color-gray-900)]">+24.5%</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-gray-400)]">Expected demand increase next 30 days</p>
            <div className="mt-8 flex h-12 items-center justify-between gap-1">
              {[40, 60, 45, 80, 70, 95, 85].map((h, i) => (
                <div key={i} className="relative h-full flex-1 cursor-help rounded-md bg-indigo-50">
                  <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full rounded-md bg-indigo-500 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--table-grid)] bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-amber-600">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest">Stock-out Risk</h3>
            </div>
            <div className="mb-4 flex items-end justify-between">
              <p className="text-4xl font-black tracking-tighter text-[var(--color-gray-900)]">8 Products</p>
              <span className="mb-1 text-xs font-black tracking-tighter text-rose-500">▲ 2 NEW</span>
            </div>
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-[var(--color-gray-400)] leading-relaxed">
              Most at risk: Sony WH-XM5, MacBook Pro 14", Logitech MX Master...
            </p>
            <button type="button" className="w-full rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-muted)] py-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-600)] transition-all hover:bg-[var(--surface-page)]">
              View All Risks
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="h-full overflow-hidden rounded-3xl border border-[var(--table-grid)] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--table-grid)] bg-white/50 px-8 py-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Recommended Replenishment</h4>
              <div className="flex items-center gap-2">
                <span className="mr-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">Sort by</span>
                <button type="button" className="flex items-center gap-1.5 rounded-lg bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-black uppercase text-[var(--color-gray-600)]">
                  Priority <ChevronRight size={10} className="rotate-90" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-[var(--table-grid)] px-8">
              {recommendations.map((rec) => {
                const tone = toneForStatus(rec.status);

                return (
                  <div key={rec.id} className="group flex flex-col items-center justify-between gap-6 py-6 transition-all md:flex-row">
                    <div className="flex w-full items-center gap-5 md:w-auto">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-transparent transition-all group-hover:border-indigo-100 ${tone.bg} ${tone.color}`}>
                        <Package size={24} />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-lg font-black tracking-tight text-[var(--color-gray-900)] transition-colors group-hover:text-indigo-600">{rec.product}</h5>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">
                          <span className="flex items-center gap-1.5">
                            Current: <span className="text-[var(--color-gray-900)]">{rec.current}</span>
                          </span>
                          <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                          <span className="flex items-center gap-1.5">
                            Demand <span className={rec.demand === 'High' || rec.demand === 'Surging' ? 'text-rose-500' : 'text-emerald-500'}>{rec.demand}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-8 border-t border-[var(--table-grid)] pt-4 md:w-auto md:border-t-0 md:pt-0">
                      <div className="text-center md:text-right">
                        <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)]">Recommended Order</p>
                        <p className={`text-xl font-black ${rec.recommended > 0 ? 'text-indigo-600' : 'text-[var(--color-gray-400)]'}`}>
                          +{rec.recommended} <span className="text-xs font-bold uppercase tracking-tight text-[var(--color-gray-400)]">Items</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest leading-none ${tone.bg} ${tone.color}`}>
                          {rec.status}
                        </span>
                        <CustomButton type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border-none bg-[var(--color-gray-900)] p-0 shadow-none">
                          <ShoppingCart size={18} className="text-white" />
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center border-t border-[var(--table-grid)] bg-[var(--surface-muted)]/50 p-8">
              <button type="button" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-gray-400)] transition-all hover:text-indigo-600">
                Generate batch orders from AI suggestions <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DrawerShell
        isOpen={isAuditOpen}
        title="Audit Log"
        subtitle="Review forecast runs and planner activity."
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
    </div>
  );
};

export default StockPlanner;
