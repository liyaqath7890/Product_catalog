import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  Clock3,
  DollarSign,
  Layers,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import CustomButton from '../components/custom/CustomButton';
import ProductDetailModal from '../components/custom/ProductDetailModal';
import ReportModal from '../components/custom/ReportModal';
import { useCategoryContext } from '../context/CategoryContext';
import { useCustomerContext } from '../context/CustomerContext';
import { useOrderContext } from '../context/OrderContext';
import { useProductContext } from '../context/ProductContext';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

const MetricCard = ({ label, value, note, icon: Icon, accent = 'text-[var(--color-primary)]' }) => (
  <div className="rounded-[1.5rem] border border-[var(--table-grid)] bg-white p-5 shadow-[0_16px_34px_rgba(16,42,67,0.05)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-gray-900)]">{value}</p>
        {note ? <p className="mt-2 text-xs font-semibold text-[var(--color-gray-500)]">{note}</p> : null}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] ${accent}`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
);

const MiniTrendChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const width = 680;
  const height = 260;
  const padding = 18;
  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y = height - padding - ((value / maxValue) * (height - padding * 2));
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="rounded-[1.6rem] border border-[var(--table-grid)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[var(--color-gray-500)]">
        <span>Weekly revenue curve</span>
        <span>{formatCurrency(data[data.length - 1]?.value || 0)}</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[250px] w-full overflow-visible">
        <defs>
          <linearGradient id="revenueArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f8b8d" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f8b8d" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((line) => {
          const y = padding + (height - padding * 2) * line;
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e5eef4" strokeWidth="1" strokeDasharray="5 5" />;
        })}
        <polygon points={areaPoints} fill="url(#revenueArea)" />
        <polyline points={points} fill="none" stroke="#0f8b8d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((value, index) => {
          const x = padding + (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
          const y = height - padding - ((value / maxValue) * (height - padding * 2));
          const isActive = hoveredIndex === index;

          return (
            <g key={data[index].label} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <circle cx={x} cy={y} r={isActive ? 6 : 4} fill="#fff" stroke="#0f8b8d" strokeWidth="2.5" />
              {isActive ? (
                <text x={x} y={y - 16} textAnchor="middle" className="fill-[var(--color-gray-900)] text-[10px] font-bold">
                  {formatCurrency(value)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {data.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-400)]">{item.label}</div>
            <div className="mt-1 text-[11px] font-semibold text-[var(--color-gray-700)]">{formatCurrency(item.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#0f8b8d', '#22c1d1', '#f59e0b', '#f97316', '#ef4444'];
  const segments = data.reduce(
    (accumulator, item, index) => {
      const dash = (item.value / total) * circumference;
      accumulator.push({
        item,
        color: colors[index % colors.length],
        dash,
        offset: accumulator.length === 0 ? 0 : accumulator[accumulator.length - 1].offset + accumulator[accumulator.length - 1].dash,
      });
      return accumulator;
    },
    [],
  );

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#eef4f8" strokeWidth="18" />
        {segments.map(({ item, color, dash, offset }) => (
          <circle
            key={item.label}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
          />
        ))}
      </svg>

      <div className="min-w-0 flex-1 space-y-2">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="truncate font-semibold text-[var(--color-gray-700)]">{item.label}</span>
            </div>
            <span className="font-bold text-[var(--color-gray-900)]">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusTone = {
  Live: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Draft: 'bg-amber-50 text-amber-700 border-amber-100',
  Archived: 'bg-slate-100 text-slate-600 border-slate-200',
  'Action Needed': 'bg-rose-50 text-rose-600 border-rose-100',
};

const statusClass = (status) => statusTone[status] || 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--table-grid)]';

const Dashboard = () => {
  const navigate = useNavigate();
  const { products } = useProductContext();
  const { categories: catalogCategories } = useCategoryContext();
  const { orders } = useOrderContext();
  const { customers } = useCustomerContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const totals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalAssetValue = products.reduce(
      (sum, product) => sum + Number(product.price || 0) * Number(product.qty || product.stock || 0),
      0,
    );
    const liveProducts = products.filter((product) => product.status === 'Live').length;
    const lowStockProducts = products
      .filter((product) => Number(product.qty || product.stock || 0) < 10)
      .sort((left, right) => Number(left.qty || left.stock || 0) - Number(right.qty || right.stock || 0));
    const averageRating = products.length
      ? products.reduce((sum, product) => sum + Number(product.rating || 0), 0) / products.length
      : 0;
    const vipCustomers = customers.filter((customer) => String(customer.status || '').includes('VIP')).length;
    const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      totalAssetValue,
      liveProducts,
      lowStockProducts,
      averageRating,
      vipCustomers,
      averageOrderValue,
    };
  }, [products, orders, customers]);

  const categoryNavItems = useMemo(
    () => [
      { id: 'all', name: 'All', route: '/products', count: products.length },
      ...catalogCategories.map((category) => ({
        ...category,
        route: `/categories/details/${category.id}`,
        count: products.filter((product) => product.category === category.name).length,
      })),
    ],
    [catalogCategories, products],
  );

  const handleCategoryNavigate = (item) => {
    setSelectedCategory(item.name);

    if (item.name === 'All') {
      navigate('/products');
      return;
    }

    navigate(item.route || '/products');
  };

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        !query ||
        [product.name, product.brand, product.category, ...(product.tags || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  const categoryInsights = useMemo(() => {
    const counts = products.reduce((accumulator, product) => {
      const key = product.category || 'Other';
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count);
  }, [products]);

  const orderStatusSummary = useMemo(() => {
    const buckets = orders.reduce((accumulator, order) => {
      const key = order.status || 'Other';
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(buckets)
      .map(([label, count]) => ({ label, count }))
      .sort((left, right) => right.count - left.count);
  }, [orders]);

  const topProducts = useMemo(
    () => [...products]
      .sort(
        (left, right) =>
          Number(right.price || 0) * Number(right.qty || right.stock || 0) -
          Number(left.price || 0) * Number(left.qty || left.stock || 0),
      )
      .slice(0, 4),
    [products],
  );

  const spotlightProducts = useMemo(() => {
    if (searchTerm.trim() || selectedCategory !== 'All') {
      return filteredProducts.slice(0, 4);
    }

    return topProducts;
  }, [filteredProducts, searchTerm, selectedCategory, topProducts]);

  const salesSeries = useMemo(() => {
    const baseSeries = orders.length
      ? orders.slice(0, 7).map((order) => Math.max(900, Number(order.total || 0)))
      : [1800, 2400, 2100, 3000, 2600, 3900, 3400];

    while (baseSeries.length < 7) {
      baseSeries.push(Math.round((totals.totalRevenue || 2800) / 7));
    }

    return WEEK_LABELS.map((label, index) => ({
      label,
      value: baseSeries[index] || 0,
    }));
  }, [orders, totals.totalRevenue]);

  const lowStockPercent = products.length ? Math.round((totals.lowStockProducts.length / products.length) * 100) : 0;
  const goalProgress = Math.min(100, Math.round((totals.totalRevenue / Math.max(1, totals.totalAssetValue + totals.totalRevenue)) * 100));
  const revenueGap = Math.max(0, Math.round(totals.totalAssetValue * 0.18));

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10 animate-in fade-in duration-700">
      <section className="surface-card overflow-hidden rounded-[2rem] border border-[var(--table-grid)] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbfd_46%,#edf7fb_100%)] p-6 sm:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--table-grid)] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)] shadow-sm">
            <Sparkles size={13} />
            Product catalog command center
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
            <div className="flex items-center rounded-[1.2rem] border border-[var(--table-grid)] bg-white px-4 py-2.5 shadow-sm focus-within:ring-4 focus-within:ring-[var(--color-primary-light)]">
              <Search size={16} className="text-[var(--color-gray-400)]" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="text"
                placeholder="Search products, brands, or tags"
                className="ml-3 w-[240px] border-none bg-transparent text-sm font-medium text-[var(--color-gray-800)] outline-none placeholder:text-[var(--color-gray-400)]"
              />
            </div>
            <CustomButton variant="outline" onClick={() => setIsReportModalOpen(true)} className="h-10 px-4 text-[12px]">
              Generate Report
            </CustomButton>
            <CustomButton onClick={() => navigate('/products/create-page')} className="h-10 px-4 text-[12px]">
              Add Product
            </CustomButton>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categoryNavItems.map((category) => (
            <CustomButton
              key={category.id}
              type="button"
              variant={selectedCategory === category.name ? 'primary' : 'outline'}
              onClick={() => handleCategoryNavigate(category)}
              className="h-9 rounded-full px-4 text-[11px] uppercase tracking-[0.16em]"
            >
              {category.name}
            </CustomButton>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Expected earnings"
            value={formatCurrency(totals.totalRevenue)}
            note={`${goalProgress}% of monthly target reached`}
            icon={DollarSign}
          />
          <MetricCard
            label="Orders this month"
            value={orders.length}
            note={`${Math.max(0, 60 - orders.length)} to goal`}
            icon={ShoppingCart}
            accent="text-emerald-600"
          />
          <MetricCard
            label="Average daily sales"
            value={formatCurrency(Math.round(totals.totalRevenue / 30 || 0))}
            note="Smoothed over the last 30 days"
            icon={TrendingUp}
            accent="text-amber-600"
          />
          <MetricCard
            label="Live products"
            value={totals.liveProducts}
            note={`${totals.vipCustomers} VIP customers in the catalog`}
            icon={Users}
            accent="text-sky-600"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="surface-card rounded-[1.9rem] border border-[var(--table-grid)] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">Sales this month</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-gray-900)]">
                  Product momentum and revenue progression
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-gray-500)]">
                  Use this view to see what is moving, what needs attention, and how quickly the catalog is growing.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-[var(--color-primary-light)] px-4 py-3 text-sm font-bold text-[var(--color-primary)]">
                  Another {formatCurrency(revenueGap)} to goal
                </div>
                <CustomButton variant="outline" onClick={() => setIsReportModalOpen(true)} className="h-10 px-4 text-[12px]">
                  View report
                </CustomButton>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--table-grid)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[var(--color-gray-500)]">
                <span className="inline-flex items-center gap-2">
                  <BarChart3 size={15} className="text-[var(--color-primary)]" />
                  Revenue trend
                </span>
                <span>{goalProgress}% of target</span>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <MiniTrendChart data={salesSeries} />
                <div className="rounded-[1.4rem] border border-[var(--table-grid)] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-gray-400)]">Sales mix</p>
                    <p className="text-xs font-semibold text-[var(--color-gray-500)]">{orders.length} orders</p>
                  </div>
                  <DonutChart data={orderStatusSummary.slice(0, 4).map((item) => ({ ...item, value: item.count }))} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.2rem] bg-[var(--color-primary-light)] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">Asset value</p>
                  <p className="mt-2 text-lg font-bold text-[var(--color-gray-900)]">{formatCurrency(totals.totalAssetValue)}</p>
                </div>
                <div className="rounded-[1.2rem] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">Avg order value</p>
                  <p className="mt-2 text-lg font-bold text-[var(--color-gray-900)]">{formatCurrency(totals.averageOrderValue)}</p>
                </div>
                <div className="rounded-[1.2rem] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">Average rating</p>
                  <p className="mt-2 text-lg font-bold text-[var(--color-gray-900)]">{totals.averageRating.toFixed(1)} / 5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[1.9rem] border border-[var(--table-grid)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">Recent orders</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-gray-900)]">Keep fulfillment visible</h3>
              </div>
              <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                <Clock3 size={18} />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[var(--table-grid)] bg-white">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr] border-b border-[var(--table-grid)] bg-[var(--surface-muted)] px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-gray-400)]">
                <span>Order</span>
                <span>Customer</span>
                <span>Payment</span>
                <span>Status</span>
                <span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-[var(--table-grid)]">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.9fr] items-center px-4 py-4 text-sm">
                    <div>
                      <p className="font-bold text-[var(--color-gray-900)]">{order.id}</p>
                      <p className="text-xs text-[var(--color-gray-500)]">{order.date}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[var(--color-gray-800)]">{order.customer}</p>
                      <p className="truncate text-xs text-[var(--color-gray-500)]">{order.email}</p>
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-gray-600)]">{order.payment}</div>
                    <div>
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right font-bold text-[var(--color-gray-900)]">{formatCurrency(order.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <div className="surface-card rounded-[1.9rem] border border-[var(--table-grid)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">Inventory watchlist</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-gray-900)]">Low stock items</h3>
              </div>
              <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                <AlertTriangle size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {totals.lowStockProducts.length > 0 ? (
                totals.lowStockProducts.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => navigate('/inventory/planner')}
                    className="flex w-full items-center justify-between rounded-[1.15rem] border border-[var(--table-grid)] bg-white px-4 py-3 text-left transition-standard hover:border-[var(--color-primary)] hover:shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-gray-900)]">{product.name}</p>
                      <p className="text-xs text-[var(--color-gray-500)]">{product.category}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      {product.qty ?? product.stock ?? 0} left
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.2rem] bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
                  All stock levels are healthy.
                </div>
              )}
            </div>

            <div className="mt-4 rounded-[1.2rem] border border-[var(--table-grid)] bg-[var(--surface-muted)] px-4 py-4">
              <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-gray-600)]">
                <span>Low stock pressure</span>
                <span>{lowStockPercent}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#f59e0b,#f97316)]"
                  style={{ width: `${Math.max(lowStockPercent, 8)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[1.9rem] border border-[var(--table-grid)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">Category mix</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-gray-900)]">Catalog distribution</h3>
              </div>
              <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                <Layers size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {categoryInsights.slice(0, 4).map((item) => {
                const percentage = products.length ? Math.round((item.count / products.length) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[var(--color-gray-800)]">{item.label}</span>
                      <span className="text-[var(--color-gray-500)]">{percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,#0f8b8d,#22c1d1)]"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="surface-card rounded-[1.9rem] border border-[var(--table-grid)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">Top products</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[var(--color-gray-900)]">Highest catalog impact</h3>
              </div>
              <div className="rounded-2xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                <ShoppingCart size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {spotlightProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product)}
                  className="flex w-full items-center gap-3 rounded-[1.15rem] border border-[var(--table-grid)] bg-white p-3 text-left transition-standard hover:border-[var(--color-primary)] hover:shadow-sm"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-[1rem] bg-[var(--surface-muted)]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[var(--color-gray-900)]">{product.name}</p>
                    <p className="text-xs text-[var(--color-gray-500)]">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-gray-900)]">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-[var(--color-gray-500)]">{product.qty ?? product.stock ?? 0} units</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </aside>
      </section>

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        product={selectedProduct}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={() => {}}
        onRemove={() => {}}
      />

      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
