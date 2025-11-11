'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useLenis } from 'lenis/react'; 

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInBlueZone, setIsInBlueZone] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const lenis = useLenis(); 

  useEffect(() => {
    const blueZoneIds = ['laporanForm'];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);

      let inBlue = false;
      for (const id of blueZoneIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const triggerY = 120;
          if (rect.top <= triggerY && rect.bottom >= triggerY) {
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
      backgroundColor: isInBlueZone
        ? '#0369a1'
        : isScrolled
        ? 'rgba(255, 255, 255, 0.05)'
        : 'transparent',
      backdropFilter: isInBlueZone || isScrolled ? 'blur(12px)' : 'none',
      borderBottom: isInBlueZone || isScrolled
        ? '1px solid rgba(255, 255, 255, 0.25)'
        : 'none',
      ease: 'power2.out',
    });
  }, [isScrolled, isInBlueZone]);

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    const bar = e.currentTarget.querySelector('.underline-bar') as HTMLSpanElement;
    if (!bar) return;
    gsap.killTweensOf(bar);
    gsap.to(bar, {
      scaleX: enter ? 1 : 0,
      duration: 0.10, 
      ease: 'power3.out',
    });
  };

  const smoothScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target.startsWith('http')) {
      window.open(target, '_blank');
      return;
    }

    lenis?.scrollTo(target, {
      offset: -100, 
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      onComplete: () => {
        if (isMobileOpen) setIsMobileOpen(false);
      },
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
          transition: none !important;
        }
        .underline-bar {
          will-change: transform; /* ganti dari width ke transform */
        }
      `}</style>

      <nav
        id="navbar"
        className="navbar flex items-center justify-between p-4 lg:px-8 text-white"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center -m-1.5 p-1.5">
            <span className="sr-only">BBPPMPV BMTI</span>
            <Image
              src="/img/logo-bmti.png"
              alt="Logo BMTI"
              width={40}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
            <h1 className="ml-2 font-bold text-lg sm:text-xl">SIGAP</h1>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="#"
            onClick={(e) => smoothScrollTo(e, '#hero')}
            className="relative text-sm font-semibold hover:text-gray-200 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Beranda
            <span className="underline-bar block h-1 w-10 bg-white rounded-full mt-1 mx-auto transform-gpu origin-center scale-x-0"></span>
          </Link>

          <Link
            href="#panduan"
            onClick={(e) => smoothScrollTo(e, '#panduan')}
            className="relative text-sm font-semibold hover:text-gray-200 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Formulir Aduan
            <span className="underline-bar block h-1 w-10 bg-white rounded-full mt-1 mx-auto transform-gpu origin-center scale-x-0"></span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="/"
            className="relative text-sm font-semibold hover:text-gray-200 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Home <span aria-hidden="true">→</span>
            <span className="underline-bar absolute left-0 bottom-0 h-0.5 w-10 bg-white rounded-full transform-gpu origin-left scale-x-0"></span>
          </Link>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-sky-700/95 backdrop-blur-lg shadow-2xl border-t border-white/20">
          <div className="px-6 py-8 space-y-6 text-white">
            <Link href="#" onClick={(e) => { smoothScrollTo(e, '#hero'); setIsMobileOpen(false); }} className="block text-xl font-medium">
              Beranda
            </Link>
            <Link href="#panduan" onClick={(e) => { smoothScrollTo(e, '#panduan'); setIsMobileOpen(false); }} className="block text-xl font-medium">
              Panduan Pengisian
            </Link>
            <Link href="#cekStatus" onClick={(e) => { smoothScrollTo(e, '#cekStatus'); setIsMobileOpen(false); }} className="block text-xl font-medium">
              Cek Status Pengaduan
            </Link>
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="block text-xl font-medium"
            >
              Home →
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;