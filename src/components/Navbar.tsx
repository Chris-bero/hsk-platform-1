import { useState } from 'react';
import { Eye, EyeOff, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { theme, toggleTheme, showPinyin, togglePinyin, currentStudent, logout, vaultCount } =
    useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: AppView; label: string; count?: number }[] = [
    { view: 'home', label: 'الرئيسية' },
    { view: 'chapters', label: 'الفصول' },
    { view: 'collections', label: 'التجميعات' },
    { view: 'labs', label: 'المختبرات' },
    { view: 'vault', label: 'محفوظاتي', count: vaultCount },
    { view: 'hsk-portal', label: 'امتحانات HSK' },
    { view: 'analytics', label: 'إحصائياتي' },
  ];

  const isNavActive = (view: AppView) => {
    if (view === 'chapters') {
      return (
        currentView === 'chapters' ||
        currentView === 'chapter-hub' ||
        currentView === 'custom-builder' ||
        currentView === 'drill'
      );
    }
    if (view === 'hsk-portal') {
      return currentView === 'hsk-portal' || currentView === 'mock-exam';
    }
    return currentView === view;
  };

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-[#F9F6F0]/95 dark:bg-[#121110]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-5">
        {/* العلامة التجارية */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-right min-w-0 lg:shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] rounded-md py-1"
        >
          <span
            aria-hidden="true"
            className="cinnabar-seal font-hanzi w-8 h-8 flex items-center justify-center text-sm font-bold rounded-[3px] shrink-0"
          >
            汉
          </span>
          <span className="text-sm sm:text-base xl:text-lg font-bold tracking-tight text-[#1C1917] dark:text-[#F5F2EB] truncate">
            بوابة اللغة الصينية - المستوى الأول
          </span>
        </button>

        {/* روابط التنقل الرئيسية */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-semibold"
        >
          {navItems.map((item) => {
            const active = isNavActive(item.view);
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNavClick(item.view)}
                className={`relative py-2 inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] rounded-sm ${
                  active
                    ? 'text-[#B91C1C] dark:text-[#EF4444]'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[11px] font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                    ({item.count})
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-[#B91C1C] dark:bg-[#EF4444]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* أدوات التحكم العالمية */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={togglePinyin}
            aria-pressed={showPinyin}
            title={showPinyin ? 'إخفاء البينين في جميع الصفحات' : 'إظهار البينين في جميع الصفحات'}
            className={`inline-flex items-center gap-2 px-3 py-2 min-h-[40px] text-xs font-semibold rounded-md border transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444] ${
              showPinyin
                ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
            }`}
          >
            {showPinyin ? <Eye className="w-4 h-4 shrink-0" /> : <EyeOff className="w-4 h-4 shrink-0" />}
            <span>{showPinyin ? 'إخفاء البينين' : 'إظهار البينين'}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع النهاري'}
            title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB] hover:border-[#B91C1C]/40 dark:hover:border-[#EF4444]/40 transition-colors duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444]"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
          </button>

          {currentStudent && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] text-xs font-semibold rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-[#57534E] dark:text-[#A8A29E] hover:text-[#B91C1C] dark:hover:text-[#EF4444] hover:border-[#B91C1C]/40 dark:hover:border-[#EF4444]/40 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444]"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>خروج</span>
            </button>
          )}
        </div>

        {/* زر القائمة للشاشات الصغيرة */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-[#1C1917] dark:text-[#F5F2EB]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* القائمة المنسدلة للجوال */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 bg-white dark:bg-[#1E1C1A] px-4 py-4 space-y-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isNavActive(item.view);
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full text-right px-3 py-2.5 rounded-md text-sm font-semibold flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-[#B91C1C]/10 dark:bg-[#EF4444]/15 text-[#B91C1C] dark:text-[#EF4444]'
                      : 'text-[#1C1917] dark:text-[#F5F2EB] hover:bg-[#F9F6F0] dark:hover:bg-[#292623]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-xs font-bold tabular-nums text-[#D97706] dark:text-[#F59E0B]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="md:hidden pt-3 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePinyin}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 min-h-[44px] text-xs font-semibold rounded-md border ${
                showPinyin
                  ? 'border-[#D97706]/40 dark:border-[#F59E0B]/40 bg-[#D97706]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#F59E0B]'
                  : 'border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-[#57534E] dark:text-[#A8A29E]'
              }`}
            >
              {showPinyin ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{showPinyin ? 'إخفاء البينين' : 'إظهار البينين'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 text-[#1C1917] dark:text-[#F5F2EB]"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
              <span>{theme === 'light' ? 'ليلي' : 'نهاري'}</span>
            </button>

            {currentStudent && (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-semibold rounded-md border border-[#B91C1C]/30 dark:border-[#EF4444]/30 text-[#B91C1C] dark:text-[#EF4444]"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
