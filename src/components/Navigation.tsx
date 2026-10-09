import React from 'react';
import { Home, Compass, BookOpen, GraduationCap, MoreHorizontal } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNavigation: React.FC<NavigationProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'prayer', label: 'الصلاة', icon: Compass },
    { id: 'quran', label: 'القرآن', icon: BookOpen },
    { id: 'learning', label: 'التعلم', icon: GraduationCap },
    { id: 'more', label: 'المزيد', icon: MoreHorizontal },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'more' && currentTab === 'istighfar');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-800 font-bold bg-emerald-50/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-800 stroke-[2.2]' : 'text-slate-500'}`} />
              <span className="text-[11px] leading-tight truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
