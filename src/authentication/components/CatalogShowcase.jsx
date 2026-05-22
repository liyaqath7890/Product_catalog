import React from 'react';
import { Activity, Package, ShieldCheck, Sparkles } from 'lucide-react';
import catalogHero from '../../assets/auth/catalog-auth-hero.svg';

const floatingCards = [
  {
    label: '12.4k SKUs',
    value: 'Live catalog',
    icon: Package,
    position: 'left-5 top-8',
    animation: 'catalog-float',
  },
  {
    label: '98.2%',
    value: 'Stock accuracy',
    icon: Activity,
    position: 'right-5 top-[4.5rem]',
    animation: 'catalog-float-delay',
  },
  {
    label: 'Secure',
    value: 'Protected access',
    icon: ShieldCheck,
    position: 'left-12 bottom-10',
    animation: 'catalog-float-slow',
  },
];

const CatalogShowcase = ({ compact = false }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/18 bg-white/10 ${
        compact ? 'p-3.5' : 'p-5'
      } backdrop-blur-sm`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_25%),linear-gradient(135deg,rgba(6,61,115,0.18),rgba(6,174,214,0.12),rgba(255,255,255,0.02))]" />
      <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-[#a5f3fc]/25 blur-2xl" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/85">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 shadow-[0_10px_20px_rgba(5,45,68,0.12)]">
            <Sparkles size={13} />
            Product Catalog
          </span>
          <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5">Inventory + Brands</span>
          <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5">Realtime Access</span>
        </div>

        <div className={`relative ${compact ? 'min-h-[160px]' : 'min-h-[360px]'}`}>
          <div className="absolute inset-x-10 top-4 h-[90%] rounded-[1.8rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.06)_100%)] shadow-[0_30px_80px_rgba(5,45,68,0.22)]" />
          <div className="absolute inset-x-14 top-8 rounded-[1.45rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(240,248,255,0.95)_100%)] p-3 shadow-[0_24px_54px_rgba(5,45,68,0.16)]">
            <div className="flex items-center justify-between rounded-[1.1rem] bg-[linear-gradient(135deg,#0f8b8d,#159ba1)] px-3 py-2.5 text-white shadow-[0_12px_28px_rgba(15,139,141,0.26)]">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/72">Catalog overview</p>
                <p className="mt-1 text-base font-semibold">Product dashboard</p>
              </div>
              <div className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold">Live Sync</div>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_1.15fr] gap-3">
              <div className="rounded-[1.2rem] border border-[rgba(15,139,141,0.12)] bg-white p-3.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">
                  <span>Revenue</span>
                  <span>Monthly</span>
                </div>
                <p className="mt-2.5 text-xl font-bold text-[var(--color-gray-900)]">98.2%</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded-full bg-[var(--color-primary-light)]">
                    <div className="h-2 w-[82%] rounded-full bg-[linear-gradient(90deg,#0f8b8d,#15b8c3)]" />
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-primary-light)]">
                    <div className="h-2 w-[68%] rounded-full bg-[linear-gradient(90deg,#159ba1,#33d0ce)]" />
                  </div>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[rgba(15,139,141,0.12)] bg-white p-3.5">
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">
                  <span>Top categories</span>
                  <span>6 active</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {['Shoes', 'Beauty', 'Fashion', 'Bags'].map((label, index) => (
                    <div key={label} className="rounded-[0.9rem] bg-[linear-gradient(180deg,#f8fbfd_0%,#eef8fa_100%)] px-2.5 py-2.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-500)]">{label}</p>
                      <p className="mt-1.5 text-sm font-bold text-[var(--color-gray-900)]">{[34, 27, 19, 12][index]}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <img
            src={catalogHero}
            alt="Catalog dashboard illustration"
            className={`relative mx-auto h-auto w-full max-w-[680px] drop-shadow-[0_30px_68px_rgba(15,23,42,0.18)] ${
              compact ? 'max-w-[340px] pt-3' : 'pt-7'
            }`}
          />

          {!compact
            ? floatingCards.map(({ label, value, icon: Icon, position, animation }) => (
                <div
                  key={label}
                  className={`auth-glow absolute ${position} ${animation} rounded-[1.4rem] border border-white/20 bg-white/16 px-4 py-3 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur-md`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-white/75">{value}</p>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default CatalogShowcase;
