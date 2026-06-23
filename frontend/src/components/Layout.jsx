import { Link, useLocation } from 'react-router-dom';
import { Bot, LayoutDashboard, Plug, MessageSquare, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agents/new', label: 'New Agent', icon: Bot },
  { path: '/providers', label: 'Providers', icon: Plug },
  { path: '/quick-chat', label: 'Quick Chat', icon: Zap },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-950 text-white flex flex-col">
        <div className="p-6 border-b border-primary-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">OmniAgent</h1>
              <p className="text-xs text-primary-300">Universal AI Framework</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-800">
          <div className="text-xs text-primary-400">
            <p>OmniAgent v1.0.0</p>
            <p>All providers supported</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
