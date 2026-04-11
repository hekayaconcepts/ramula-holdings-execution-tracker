'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface NavigationProps {
  user?: {
    email?: string | null;
  };
  onLogout?: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tracker', href: '/dashboard/tracker' },
    { name: 'Expense', href: '/dashboard/expense' },
    { name: 'Revenue', href: '/dashboard/revenue' },
    { name: 'Legal', href: '/dashboard/legal' },
    { name: 'CEO', href: '/dashboard/ceo' },
    { name: 'COO', href: '/dashboard/coo' },
    { name: 'Brand', href: '/dashboard/brand' },
    { name: 'Content', href: '/dashboard/content' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation tabs */}
          <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#d49a30] text-white shadow-md transform scale-105'
                      : 'text-[#091d28] hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - User dropdown */}
          <div className="flex items-center ml-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-bold text-[#091d28] hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#091d28] flex items-center justify-center text-white text-xs">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline">{user?.email || 'User'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Logged in as <br/>
                    <span className="font-bold text-[#091d28]">{user?.email}</span>
                  </div>
                  <button
                    onClick={onLogout || handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-[#ef4444] font-bold hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
