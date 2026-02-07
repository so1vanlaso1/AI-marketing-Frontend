"use client";
import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/features/auth/authSlice";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated} = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const showAuthedLinks = mounted && isAuthenticated;
  const t = useTranslations('navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white/90 border border-white/20 px-3 py-1 rounded-full">
            AI.Tech
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm text-white/90 font-medium">
          <li><a className="hover:text-slate-700 transition" href="#features">{t('features')}</a></li>
          <li><a className="hover:text-slate-700 transition" href="#pricing">{t('pricing')}</a></li>
          <li><a className="hover:text-slate-700 transition" href="#docs">{t('docs')}</a></li>
          {showAuthedLinks && (
            <>
              <li><Link className="hover:text-slate-700 transition" href="/Users">{t('users')}</Link></li>
              <li><Link className="hover:text-slate-700 transition" href="/Projects">{t('projects')}</Link></li>
            </>
          )}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 border border-white/20 rounded-full px-2 py-1">
            <button
              onClick={() => switchLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded-full transition ${
                locale === 'en' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLanguage('vi')}
              className={`px-2 py-1 text-xs font-medium rounded-full transition ${
                locale === 'vi' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
              }`}
            >
              VI
            </button>
          </div>

          {showAuthedLinks ? (
            <>
              <Image
                src="/user_6645221.png"
                alt="User avatar"
                width={25}
                height={25}
                loading="lazy"
              />
              <button
                onClick={() => dispatch(logout())}
                className="text-xs font-medium text-white hover:text-slate-700 transition"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/Auth/login"
                className="rounded-md border border-black/20 px-4 py-2 text-xs font-medium text-white hover:bg-black/5 transition"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/Auth/register"
                className="rounded-md border border-black/20 px-4 py-2 text-xs font-medium text-white hover:bg-black/5 transition"
              >
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;