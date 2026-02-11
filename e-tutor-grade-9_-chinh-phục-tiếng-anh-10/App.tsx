
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  LayoutDashboard, 
  MessageSquare, 
  Library, 
  LogOut,
  Settings,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { AppTab } from './types';
import Dashboard from './components/Dashboard';
import GrammarChecker from './components/GrammarChecker';
import ExerciseLibrary from './components/ExerciseLibrary';
import Tutor from './components/Tutor';
import LibrarySection from './components/LibrarySection';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigation = [
    { name: 'Tổng quan', icon: LayoutDashboard, tab: AppTab.DASHBOARD },
    { name: 'Sửa lỗi ngữ pháp', icon: CheckCircle, tab: AppTab.GRAMMAR_CHECK },
    { name: 'Bài tập ôn luyện', icon: BookOpen, tab: AppTab.EXERCISES },
    { name: 'Trợ lý AI 24/7', icon: MessageSquare, tab: AppTab.TUTOR },
    { name: 'Thư viện kiến thức', icon: Library, tab: AppTab.LIBRARY },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard setActiveTab={setActiveTab} />;
      case AppTab.GRAMMAR_CHECK: return <GrammarChecker />;
      case AppTab.EXERCISES: return <ExerciseLibrary />;
      case AppTab.TUTOR: return <Tutor />;
      case AppTab.LIBRARY: return <LibrarySection />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              E-Tutor Grade 9
            </h1>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.tab 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                HS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Học sinh Lớp 9</p>
                <p className="text-xs text-gray-500 truncate">Lộ trình ôn thi 10</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 p-2">
            <Menu size={24} />
          </button>
          
          <div className="flex-1 md:flex-none">
            <h2 className="text-lg font-semibold text-gray-800">
              {navigation.find(n => n.tab === activeTab)?.name}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
            <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50">
              <LogOut size={18} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
