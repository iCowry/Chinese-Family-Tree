import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '首页', icon: 'fas fa-home' },
    { path: '/surnames', label: '姓氏管理', icon: 'fas fa-book' },
    { path: '/families', label: '家族管理', icon: 'fas fa-users' },
    { path: '/members', label: '成员管理', icon: 'fas fa-user-friends' },
    { path: '/tree', label: '世系图', icon: 'fas fa-project-diagram' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-paper-gray flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-china-red text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
           <i className="fas fa-scroll"></i> 华夏家谱
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl focus:outline-none">
          <i className={isSidebarOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 h-screen w-64 bg-ink-black text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block
        `}
      >
        <div className="p-6 border-b border-gray-700 bg-china-red">
           <h1 className="text-2xl font-bold flex items-center gap-2 text-noble-gold">
             <i className="fas fa-scroll"></i> 华夏家谱
           </h1>
           <p className="text-xs text-white/80 mt-1">传承中华文化，铭记家族历史</p>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3
                ${location.pathname === item.path 
                  ? 'bg-noble-gold text-ink-black font-bold shadow-lg' 
                  : 'hover:bg-gray-700 text-gray-300'}
              `}
            >
              <i className={`${item.icon} w-6 text-center`}></i>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; 2025 华夏家谱平台
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};