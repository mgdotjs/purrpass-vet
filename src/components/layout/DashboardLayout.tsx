'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home,
  Calendar,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Building2,
  Stethoscope,
  PawPrint
} from 'lucide-react';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ('VET' | 'USER')[];
}

const menuItems: MenuItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
    roles: ['VET', 'USER']
  },
  {
    href: '/appointments',
    label: 'Randevular',
    icon: Calendar,
    roles: ['VET', 'USER']
  },
  {
    href: '/appointments/new',
    label: 'Randevu Oluştur',
    icon: Plus,
    roles: ['VET', 'USER']
  },
  {
    href: '/pets',
    label: 'Hayvanlarım',
    icon: PawPrint,
    roles: ['USER']
  },
  {
    href: '/pets/new',
    label: 'Hayvan Ekle',
    icon: Plus,
    roles: ['USER']
  },
  {
    href: '/patients',
    label: 'Hastalar',
    icon: Heart,
    roles: ['VET']
  },
  {
    href: '/clinic',
    label: 'Klinik Bilgileri',
    icon: Building2,
    roles: ['VET']
  },
  {
    href: '/profile',
    label: 'Profil',
    icon: User,
    roles: ['VET', 'USER']
  }
];

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardLayout({ 
  children, 
  title = 'PurrPass',
  description 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || 'USER')
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">PurrPass</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.role === 'VET' ? 'Dr.' : ''} {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Page title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h1>
                {description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Header actions - can be extended */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle or other actions can be added here */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
