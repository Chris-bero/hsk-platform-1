import React, { useState } from 'react';
import { AlertCircle, KeyRound, Moon, Sun, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ALLOWED_STUDENTS } from '../data/students';

const LOGIN_SCROLL_ART = '/src/assets/images/neo_chinese_login_scroll_1795181947033.jpg';

export function LoginGate() {
  const { login, theme, toggleTheme } = useApp();
  const [nameInput, setNameInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nameInput.trim() || !codeInput.trim()) {
      setErrorMsg('يرجى إدخال اسم الطالب ورمز الدخول.');
      return;
    }

    const success = login(nameInput, codeInput);
    if (!success) {
      setErrorMsg('تعذر التحقق من البيانات. تأكد من مطابقة الاسم والرمز المسجل لدى المعلم.');
    }
  };

  const fillTestStudent = (name: string, code: string) => {
    setNameInput(name);
    setCodeInput(code);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen paper-lattice bg-[#F9F6F0] dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] flex flex-col">
      {/* شريط علوي هادئ لتبديل المظهر فقط */}
      <div className="mx-auto w-full max-w-6xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="cinnabar-seal font-hanzi w-9 h-9 flex items-center justify-center text-base font-bold rounded-[3px]"
          >
            汉
          </span>
          <span className="text-base sm:text-lg font-bold">
            بوابة اللغة الصينية - المستوى الأول
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع النهاري'}
          className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-md border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-white dark:bg-[#1E1C1A] text-xs font-semibold hover:border-[#B91C1C]/40 dark:hover:border-[#EF4444]/40 transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              <span>حبر الليل</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#F59E0B]" />
              <span>ورق الأرز</span>
            </>
          )}
        </button>
      </div>

      {/* بطاقة الدخول الثنائية */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="neo-frame w-full max-w-4xl rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm"
        >
          {/* عمود النموذج */}
          <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#1E1C1A]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-3">
                <span>المنهج التأسيسي</span>
                <span aria-hidden="true">·</span>
                <span>الإصدار الثالث</span>
                <span aria-hidden="true">·</span>
                <span>١٥ فصلاً</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F2EB] leading-snug mb-2">
                تسجيل دخول الطالب
              </h1>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-8">
                أدخل اسمك المسجّل ورمز الدخول الخاص بك لمتابعة التدريب وحفظ تقدمك وإحصائياتك.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="student-name"
                    className="block text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] mb-2"
                  >
                    اسم الطالب
                  </label>
                  <div className="relative">
                    <User
                      aria-hidden="true"
                      className="w-4 h-4 text-[#57534E] dark:text-[#A8A29E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      id="student-name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="مثال: أحمد محمد"
                      autoComplete="username"
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0]/60 dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] placeholder:text-[#57534E]/60 dark:placeholder:text-[#A8A29E]/50 text-sm focus:outline-none focus:border-[#B91C1C] dark:focus:border-[#EF4444] focus:ring-2 focus:ring-[#B91C1C]/15 dark:focus:ring-[#EF4444]/20 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="student-code"
                    className="block text-sm font-semibold text-[#1C1917] dark:text-[#F5F2EB] mb-2"
                  >
                    رمز الدخول
                  </label>
                  <div className="relative">
                    <KeyRound
                      aria-hidden="true"
                      className="w-4 h-4 text-[#57534E] dark:text-[#A8A29E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      id="student-code"
                      type="password"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="أدخل الرمز المخصص لك"
                      autoComplete="current-password"
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-[#1C1917]/15 dark:border-[#F5F2EB]/15 bg-[#F9F6F0]/60 dark:bg-[#121110] text-[#1C1917] dark:text-[#F5F2EB] placeholder:text-[#57534E]/60 dark:placeholder:text-[#A8A29E]/50 text-sm tabular-nums focus:outline-none focus:border-[#B91C1C] dark:focus:border-[#EF4444] focus:ring-2 focus:ring-[#B91C1C]/15 dark:focus:ring-[#EF4444]/20 transition-colors"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3.5 rounded-lg border border-[#B91C1C]/30 dark:border-[#EF4444]/35 bg-[#B91C1C]/8 dark:bg-[#EF4444]/12 text-[#B91C1C] dark:text-[#EF4444] text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-6 min-h-[46px] rounded-lg bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EF4444] dark:hover:bg-[#DC2626] text-white font-bold text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B91C1C] dark:focus-visible:ring-[#EF4444]"
                >
                  دخول إلى المنصة
                </button>
              </form>
            </div>

            {/* حسابات تجريبية سريعة للمعاينة */}
            <div className="mt-8 pt-6 border-t border-[#1C1917]/10 dark:border-[#F5F2EB]/10">
              <p className="text-xs font-semibold text-[#57534E] dark:text-[#A8A29E] mb-3">
                حسابات تجريبية جاهزة للمعاينة (اضغط للتعبئة التلقائية):
              </p>
              <div className="flex flex-wrap gap-2.5">
                {ALLOWED_STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => fillTestStudent(student.name, student.code)}
                    className="px-3.5 py-2 text-xs rounded-md border border-[#1C1917]/12 dark:border-[#F5F2EB]/15 bg-[#F9F6F0] dark:bg-[#121110] hover:border-[#B91C1C]/45 dark:hover:border-[#EF4444]/45 text-[#1C1917] dark:text-[#F5F2EB] transition-colors"
                  >
                    <span className="font-semibold">{student.name}</span>
                    <span className="mx-1.5 text-[#57534E] dark:text-[#A8A29E]">·</span>
                    <span className="tabular-nums text-[#57534E] dark:text-[#A8A29E]">
                      الرمز: {student.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* عمود اللوحة الفنية الصينية */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[#F2ECE1] dark:bg-[#181614] border-t lg:border-t-0 lg:border-r border-[#1C1917]/10 dark:border-[#F5F2EB]/10 overflow-hidden">
            {!imageError ? (
              <img
                src={LOGIN_SCROLL_ART}
                alt="لوحة فنية تقليدية بالحبر الصيني لأغصان الخيزران وزهر البرقوق"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover dark:opacity-80"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="cinnabar-seal font-hanzi w-20 h-20 flex items-center justify-center text-4xl font-bold rounded-sm mb-4">
                  学
                </div>
                <p className="font-hanzi text-2xl text-[#1C1917] dark:text-[#F5F2EB]">
                  学而时习之
                </p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121110]/85 via-[#121110]/45 to-transparent p-6 text-[#F5F2EB]">
              <p className="font-hanzi text-xl tracking-wide mb-1">千里之行，始于足下</p>
              <p className="text-xs text-[#F5F2EB]/85 leading-relaxed">
                رحلة الألف ميل تبدأ بخطوة واحدة — تدريب يومي منظم لإتقان المستوى الأول.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
