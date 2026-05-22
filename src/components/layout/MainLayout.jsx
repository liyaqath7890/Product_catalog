import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-light)] font-sans text-[var(--color-gray-800)] selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)]">
      {/* Desktop Sidebar (inline, collapsible) */}
      <div className={`hidden lg:block transition-all duration-300 ease-in-out shrink-0 ${sidebarCollapsed ? 'w-[88px]' : 'w-[260px]'}`}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-[var(--color-dark)]/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar collapsed={false} onItemClick={() => setMobileSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          sidebarCollapsed={isMobile ? false : sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar sm:px-6 sm:py-6 lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
