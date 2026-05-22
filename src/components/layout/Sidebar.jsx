import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Tags, ShoppingCart, Users, Settings, ChevronDown, Layers, PackagePlus, List, FolderPlus, FolderEdit, Warehouse, ArrowUpDown, CalendarClock, BadgeIndianRupee, Ruler, Boxes } from 'lucide-react';
import AppLogo from './AppLogo';

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const navRef = useRef(null);
  const [openMenus, setOpenMenus] = useState(() => {
    if (typeof window === 'undefined') {
      return { products: true, categories: false, inventory: false };
    }

    const stored = window.localStorage.getItem('catalog-sidebar-menus');
    return stored ? JSON.parse(stored) : { products: true, categories: false, inventory: false };
  });

  const isPathActive = useCallback((path) => location.pathname.includes(path), [location.pathname]);

  useEffect(() => {
    setOpenMenus((current) => {
      const next = {
        ...current,
        ...(isPathActive('/products') ? { products: true } : {}),
        ...(isPathActive('/categories') ? { categories: true } : {}),
        ...(isPathActive('/inventory') ? { inventory: true } : {}),
      };

      const hasChanged =
        next.products !== current.products ||
        next.categories !== current.categories ||
        next.inventory !== current.inventory;

      return hasChanged ? next : current;
    });
  }, [location.pathname, isPathActive]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('catalog-sidebar-menus', JSON.stringify(openMenus));
    }
  }, [openMenus]);

  useEffect(() => {
    if (typeof window === 'undefined' || !navRef.current) {
      return;
    }

    const storedScroll = Number(window.localStorage.getItem('catalog-sidebar-scroll') || 0);
    navRef.current.scrollTop = Number.isFinite(storedScroll) ? storedScroll : 0;
  }, []);

  const toggleMenu = (key) => {
    setOpenMenus((current) => ({ ...current, [key]: !current[key] }));
  };

  const SidebarSection = ({ title }) => (
    <div className={`mt-7 mb-3 text-[9px] font-black tracking-[0.2em] uppercase text-[var(--color-gray-400)] ${collapsed ? 'px-2 text-center' : 'px-6'}`}>
      {title}
    </div>
  );

  const NavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-6'} py-2.5 text-[13px] font-semibold transition-all border-r-[3px] ${
          isActive
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]'
            : 'text-[var(--color-gray-600)] border-transparent hover:bg-[var(--color-gray-100)] hover:text-[var(--color-gray-900)]'
        }`
      }
    >
      <Icon size={18} />
      {!collapsed ? label : null}
    </NavLink>
  );

  const SubNavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 pl-14 pr-6'} py-2 text-[13px] font-medium transition-all border-r-[3px] ${
          isActive
            ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary-light)]/50'
            : 'text-[var(--color-gray-500)] border-transparent hover:text-[var(--color-gray-800)] hover:bg-[var(--color-gray-50)]'
        }`
      }
    >
      {Icon && <Icon size={14} />}
      {!collapsed ? label : null}
    </NavLink>
  );

  const CollapsibleMenu = ({ label, icon: Icon, isOpen, onToggle, isActive, children }) => (
    <div>
      <button
        onClick={onToggle}
        title={collapsed ? label : undefined}
        className={`w-full flex items-center justify-between px-6 py-2.5 text-[13px] font-semibold transition-all border-r-[3px] ${
          isActive && !isOpen
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]'
            : 'text-[var(--color-gray-600)] border-transparent hover:bg-[var(--color-gray-100)] hover:text-[var(--color-gray-900)]'
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
          <Icon size={18} />
          {!collapsed ? <span className={isActive || isOpen ? 'text-[var(--color-gray-900)]' : ''}>{label}</span> : null}
        </div>
        {!collapsed ? <ChevronDown size={14} className={`text-[var(--color-gray-400)] transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} /> : null}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'hidden' : isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-1">{children}</div>
      </div>
    </div>
  );

  return (
    <aside className={`${collapsed ? 'w-[88px]' : 'w-[260px]'} bg-white border-r border-[var(--color-gray-200)] flex flex-col h-full shrink-0 transition-all duration-300`}>
      <div className={`h-[70px] flex items-center border-b border-[var(--color-gray-200)] ${collapsed ? 'justify-center px-3' : 'px-6'}`}>
        <AppLogo collapsed={collapsed} compact />
      </div>

      <nav
        ref={navRef}
        onScroll={(event) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('catalog-sidebar-scroll', String(event.currentTarget.scrollTop));
          }
        }}
        className="flex-1 overflow-y-auto py-2 custom-scrollbar"
      >
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" end />

        {collapsed ? (
          <>
            <NavItem to="/products" icon={Tags} label="Products" />
            <NavItem to="/categories" icon={Box} label="Categories" />
            <NavItem to="/inventory" icon={Warehouse} label="Inventory" />
          </>
        ) : (
          <CollapsibleMenu label="Products" icon={Tags} isOpen={openMenus.products} onToggle={() => toggleMenu('products')} isActive={isPathActive('/products')}>
            <SubNavItem to="/products" icon={List} label="Product List" end />
            <SubNavItem to="/products/create-page" icon={PackagePlus} label="Add Product" />
            <SubNavItem to="/products/variants" icon={Layers} label="Manage Variants" />
            <SubNavItem to="/products/brands" icon={BadgeIndianRupee} label="Brands" />
            <SubNavItem to="/products/units" icon={Ruler} label="Units" />
          </CollapsibleMenu>
        )}
        {!collapsed ? (
          <>
            <CollapsibleMenu label="Categories" icon={Box} isOpen={openMenus.categories} onToggle={() => toggleMenu('categories')} isActive={isPathActive('/categories')}>
              <SubNavItem to="/categories" icon={List} label="Category List" end />
              <SubNavItem to="/categories/create" icon={FolderPlus} label="Create Category" />
              <SubNavItem to="/categories/subcategories" icon={Boxes} label="Subcategories" />
              <SubNavItem to="/categories/edit" icon={FolderEdit} label="Edit Category" />
            </CollapsibleMenu>

            <CollapsibleMenu label="Inventory" icon={Warehouse} isOpen={openMenus.inventory} onToggle={() => toggleMenu('inventory')} isActive={isPathActive('/inventory')}>
              <SubNavItem to="/inventory" icon={List} label="Stock Details" end />
              <SubNavItem to="/inventory/inbound-outbound" icon={ArrowUpDown} label="Inbound & Outbound" />
              <SubNavItem to="/inventory/planner" icon={CalendarClock} label="Stock Planner" />
            </CollapsibleMenu>
          </>
        ) : null}

        <NavItem to="/orders" icon={ShoppingCart} label="Orders" />
        <NavItem to="/customers" icon={Users} label="Customers" />

        {!collapsed ? <SidebarSection title="System" /> : null}
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      {!collapsed ? (
        <div className="p-4 border-t border-[var(--color-gray-100)]">
          <div className="bg-[var(--color-gray-50)] rounded-2xl p-4 text-center">
            <p className="text-[10px] font-black text-[var(--color-gray-400)] uppercase tracking-widest">Catalog Admin</p>
            <p className="text-xs font-bold text-[var(--color-gray-600)] mt-1">v2.0 Inventory Workspace</p>
          </div>
        </div>
      ) : null}
    </aside>
  );
};

export default Sidebar;
