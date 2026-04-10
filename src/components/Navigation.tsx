'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  user?: {
    email?: string | null;
  };
  onLogout?: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const pathname = usePathname();

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
    <nav className="bg-white border-b border-brand-gold sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Navigation tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                    isActive
                      ? 'bg-brand-gold text-brand-navy'
                      : 'text-brand-navy hover:bg-brand-light hover:text-brand-gold'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - User dropdown */}
          <div className="flex items-center">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-brand-navy hover:bg-brand-light rounded-md">
                <span>{user?.email || 'User'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-brand-gold">
                <div className="py-1">
                  {onLogout ? (
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-brand-navy hover:bg-brand-light"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-brand-navy hover:bg-brand-light"
                    >
                      Logout
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
