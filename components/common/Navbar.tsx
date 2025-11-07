'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastMain, setIsPastMain] = useState(false);
  const [isInBlueZone, setIsInBlueZone] = useState(false); 
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const blueZoneIds = ['pengaduan', 'panduan', 'cekStatus', 'manfaat'];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);

      const mainRect = document.getElementById('main-content')?.getBoundingClientRect();
      if (mainRect) {
        setIsPastMain(mainRect.bottom <= 0);
      }

      let inBlue = false;
      for (const id of blueZoneIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            inBlue = true;
            break;
          }
        }
      }
      setIsInBlueZone(inBlue);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.to('#navbar', {
      duration: 0.4,
      backgroundColor:
        isInBlueZone || isPastMain
          ? '#0369a1' 
          : isScrolled
          ? 'rgba(255, 255, 255, 0)'
          : 'transparent',
      backdropFilter: isScrolled || isInBlueZone || isPastMain ? 'blur(10px)' : 'none',
      borderBottom: isScrolled || isInBlueZone || isPastMain
        ? '1px solid rgba(255, 255, 255, 0.3)'
        : 'none',
      ease: 'power2.out',
    });
  }, [isScrolled, isPastMain, isInBlueZone]);

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    const underline = e.currentTarget.querySelector<HTMLSpanElement>('.underline-bar');
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.to(underline, {
      width: isEntering ? '2.5rem' : '0rem',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <>
      <style jsx global>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
        }
        .underline-bar {
          will-change: width;
        }
      `}</style>

      <nav
        id="navbar"
        className="navbar flex items-center justify-between p-4 lg:px-8 text-white"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/login" className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">BBPPMPV BMTI</span>
            <Image
              className="h-8 w-auto sm:h-10"
              src="/img/logo-bmti.png"
              alt="Logo BMTI"
              width={40}
              height={40}
              priority
            />
            <h1 className="ml-2 font-bold text-lg sm:text-xl">STPP</h1>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="#"
            className="relative text-sm font-semibold leading-6 hover:text-gray-300 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Beranda
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
          <Link
            href="#panduan"
            className="relative text-sm font-semibold leading-6 hover:text-gray-300 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Panduan Pengisian
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
          <Link
            href="#cekStatus"
            className="relative text-sm font-semibold leading-6 hover:text-gray-300 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Cek Status Pengaduan
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
        </div>

        {/* Home link */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="https://bbppmpvbmti.kemendikdasmen.go.id/main/"
            className="relative text-sm font-semibold leading-6 hover:text-gray-300 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Home <span aria-hidden="true">→</span>
            <span className="underline-bar absolute left-0 bottom-0 h-0.5 w-0 bg-white rounded-full"></span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-sky-600 shadow-lg">
          <div className="px-4 py-6 space-y-4 text-white">
            <Link href="#" className="block text-lg font-medium" onClick={() => setIsMobileOpen(false)}>
              Beranda
            </Link>
            <Link href="#panduan" className="block text-lg font-medium" onClick={() => setIsMobileOpen(false)}>
              Panduan Pengisian
            </Link>
            <Link href="#cekStatus" className="block text-lg font-medium" onClick={() => setIsMobileOpen(false)}>
              Cek Status Pengaduan
            </Link>
            <Link
              href="https://bbppmpvbmti.kemendikdasmen.go.id/main/"
              className="block text-lg font-medium"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;