'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Library, FileText, GraduationCap, Cross, Brain, Calculator, Atom, Telescope } from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Reading List', href: '/reading', icon: BookOpen },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Notes', href: '/notes', icon: FileText },
];

const subjectItems = [
  { name: 'Christianity', href: '/subjects/christianity', icon: Cross },
  { name: 'Philosophy', href: '/subjects/philosophy', icon: Brain },
  { name: 'Mathematics', href: '/subjects/mathematics', icon: Calculator },
  { name: 'Physics', href: '/subjects/physics', icon: Atom },
  { name: 'Cosmology', href: '/subjects/cosmology', icon: Telescope },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-gray-dark border-r border-gold/20 p-6">
      <div className="mb-8">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-gold">Yolymatics</h1>
          <p className="text-sm text-gray-400">Learning Hub</p>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Main</h2>
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold/20 text-gold'
                        : 'text-gray-300 hover:bg-gray-medium hover:text-gold'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Subjects</h2>
          <ul className="space-y-2">
            {subjectItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold/20 text-gold'
                        : 'text-gray-300 hover:bg-gray-medium hover:text-gold'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
