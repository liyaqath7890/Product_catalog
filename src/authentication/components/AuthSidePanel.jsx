import React from 'react';
import AppLogo from '../../components/layout/AppLogo';
import CatalogShowcase from './CatalogShowcase';

const AuthSidePanel = ({
  title,
  description,
  align = 'right',
  footnote,
}) => {
  return (
    <section
      className={`relative hidden h-full overflow-hidden px-4 py-5 text-white lg:flex lg:flex-col lg:justify-start xl:px-5 xl:py-6 ${
        align === 'left' ? 'lg:order-1 rounded-r-[4rem]' : 'lg:order-2 rounded-l-[4rem]'
      }`}
      style={{
        background:
          'radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 26%), radial-gradient(circle at bottom right, rgba(0,40,54,0.18), transparent 30%), linear-gradient(155deg, #0f8b8d 0%, #0f9ba0 38%, #18b6cf 72%, #b8f4ef 128%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%),linear-gradient(180deg,rgba(5,45,68,0.08)_0%,transparent_35%,rgba(5,45,68,0.12)_100%)]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/12 blur-3xl" />
      <div className="absolute bottom-4 right-[-3rem] h-80 w-80 rounded-full bg-[#07576a]/25 blur-3xl" />
      <div className="absolute left-[14%] top-[14%] h-40 w-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
      <div className="relative flex h-full flex-col justify-start">
        <div className="inline-flex w-fit rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-sm shadow-[0_16px_30px_rgba(5,45,68,0.12)]">
          <AppLogo compact />
        </div>

        <div className="mx-auto mt-4 max-w-[18rem] text-center xl:max-w-[20rem]">
          <h2 className="text-[1.95rem] font-bold tracking-tight text-white xl:text-[2.1rem]">{title}</h2>
          <p className="mt-3 text-[13px] leading-6 text-white/88">{description}</p>
        </div>

        <div className="mt-4 flex-1 overflow-hidden">
          <CatalogShowcase />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[
            { label: 'Live SKUs', value: '12.4k' },
            { label: 'Stock accuracy', value: '98.2%' },
            { label: 'Fast actions', value: '24/7' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.15rem] border border-white/15 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">{item.label}</p>
              <p className="mt-1 text-base font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {footnote ? <p className="pt-3 text-center text-sm text-white/82">{footnote}</p> : null}
      </div>
    </section>
  );
};

export default AuthSidePanel;
