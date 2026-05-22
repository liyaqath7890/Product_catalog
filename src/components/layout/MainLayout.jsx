import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-light)] font-sans text-[var(--color-gray-800)] selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)]">
      <div className={`transition-all duration-300 ease-in-out shrink-0 ${sidebarCollapsed ? 'w-[88px]' : 'w-[260px]'}`}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((previous) => !previous)}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar lg:px-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
