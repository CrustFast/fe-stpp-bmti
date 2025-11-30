'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInBlueZone, setIsInBlueZone] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const lenis = useLenis();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const blueZoneIds = ['kanalAduan', 'timeline', 'gratifikasiForm'];

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

  useEffect(() => {
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { y: -100, opacity: 0, display: 'none' });
    }
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    const links = mobileMenuRef.current.querySelectorAll('.mobile-link');
    if (isMobileOpen) {
      gsap.set(mobileMenuRef.current, { display: 'block' });
      const tl = gsap.timeline();
      tl.to(mobileMenuRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      }).fromTo(
        links,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.25'
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: 'none' });
        },
      });
      tl.to(mobileMenuRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
    }
  }, [isMobileOpen]);

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

  const toggleMobile = () => setIsMobileOpen(o => !o);

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
            <h1 className="ml-2 font-bold text-lg sm:text-xl">AKSI</h1>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={toggleMobile}
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="relative inline-flex items-center justify-center rounded-md p-2.5 text-white transition-colors"
          >
            <span className="relative w-6 h-6">
              <span className="absolute inset-0 flex items-center justify-center">
                <Menu
                  className={`h-6 w-6 transition-all duration-300 ${
                    isMobileOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
                  }`}
                />
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <X
                  className={`h-6 w-6 transition-all duration-300 ${
                    isMobileOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
                  }`}
                />
              </span>
            </span>
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
            Apa itu Gratifikasi?
            <span className="underline-bar block h-1 w-10 bg-white rounded-full mt-1 mx-auto transform-gpu origin-center scale-x-0"></span>
          </Link>

          <Link
            href="#cekStatus"
            onClick={(e) => smoothScrollTo(e, '#cekStatus')}
            className="relative text-sm font-semibold hover:text-gray-200 transition-colors"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Pengendalian Gratifikasi
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

      {/* MOBILE MENU OVERLAY (GSAP) */}
      <div
        ref={mobileMenuRef}
        className="lg:hidden fixed inset-x-0 top-0 z-40 bg-sky-700/95 backdrop-blur-lg shadow-2xl border-b border-white/20 pt-20 pb-12"
      >
        <div className="px-6 space-y-7 text-white text-lg font-medium">
          <Link
            href="#hero"
            onClick={(e) => { smoothScrollTo(e, '#hero'); toggleMobile(); }}
            className="block mobile-link"
          >
            Beranda
          </Link>
          <Link
            href="#panduan"
            onClick={(e) => { smoothScrollTo(e, '#panduan'); toggleMobile(); }}
            className="block mobile-link"
          >
            Apa itu Gratifikasi?
          </Link>
          <Link
            href="#cekStatus"
            onClick={(e) => { smoothScrollTo(e, '#cekStatus'); toggleMobile(); }}
            className="block mobile-link"
          >
            Pengendalian Gratifikasi
          </Link>
          <Link
            href="/"
            onClick={(e) => { smoothScrollTo(e, '/'); toggleMobile(); }}
            className="block mobile-link"
          >
            Home →
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;