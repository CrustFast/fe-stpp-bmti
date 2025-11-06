import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastMain, setIsPastMain] = useState(false);
  const [isInPengaduan, setIsInPengaduan] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      setIsScrolled(scrollTop > 20);

      const mainRect = document.getElementById('main-content')?.getBoundingClientRect();
      if (mainRect) {
        setIsPastMain(mainRect.bottom <= 0);
      }

      const pengaduanRect = document.getElementById('pengaduan')?.getBoundingClientRect();
      if (pengaduanRect) {
        setIsInPengaduan(pengaduanRect.top <= 0 && pengaduanRect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.to('#navbar', {
      duration: 0.3,
      backgroundColor: isInPengaduan
        ? 'rgba(0, 0, 255, 0.6)'
        : isPastMain
        ? '#0369a1'
        : isScrolled
        ? 'rgba(255, 255, 255, 0)'
        : 'transparent',
      backdropFilter: isScrolled || isInPengaduan ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
      ease: 'power2.out',
    });
  }, [isScrolled, isPastMain, isInPengaduan]);

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    const underline = e.currentTarget.querySelector<HTMLSpanElement>('.underline-bar');
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.to(underline, {
      width: isEntering ? '2.5rem' : '0rem',
      duration: 0.15,
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
          transition: background-color 0.3s, backdrop-filter 0.3s, border-bottom 0.3s;
        }
        .navbar.bg-blue {
          background-color: rgba(0, 0, 255, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          background-color: rgba(0, 0, 255, 0.6);
        }
        .navbar.bg-transparent-blur {
          background: rgba(255, 255, 255, 0);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .navbar.bg-sky {
          background-color: #0369a1; 
        }
        .underline-bar {
          will-change: width;
        }
      `}</style>

      <nav
        id="navbar"
        className={`navbar flex items-center justify-between p-4 lg:px-8 text-white ${
          isInPengaduan ? 'bg-blue' : ''
        } ${isPastMain ? 'bg-sky' : ''} ${isScrolled ? 'bg-transparent-blur' : ''}`}
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/login" className="-m-1.5 p-1 flex items-center">
            <span className="sr-only">BBPPMPV BMTI</span>
            <Image
              className="h-8 w-auto sm:h-10"
              src="/img/logo-bmti.png"
              alt="Logo BMTI"
              width={40}
              height={40}
            />
            <h1 className="flex items-center ml-2 font-bold text-lg sm:text-xl">STPP</h1>
          </Link>
        </div>
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
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="#"
            className="relative group text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-150"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Beranda
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
          <Link
            href="#panduan"
            className="relative group text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-150"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Panduan Pengisian
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
          <Link
            href="#cekStatus"
            className="relative group text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-150"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Cek Status Pengaduan
            <span className="underline-bar block h-1 w-0 bg-white rounded-full mt-1 mx-auto"></span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            href="https://bbppmpvbmti.kemdikbud.go.id/main/"
            className="relative group text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-150"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Home <span aria-hidden="true">&rarr;</span>
            <span className="underline-bar absolute left-0 bottom-0 h-0.5 w-0 bg-white rounded-full"></span>
          </Link>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="lg:hidden bg-white text-gray-900 p-4">
          <Link href="#" className="block py-2" onClick={() => setIsMobileOpen(false)}>
            Beranda
          </Link>
          <Link href="#panduan" className="block py-2" onClick={() => setIsMobileOpen(false)}>
            Panduan Pengisian
          </Link>
          <Link href="#cekStatus" className="block py-2" onClick={() => setIsMobileOpen(false)}>
            Cek Status Pengaduan
          </Link>
          <Link href="https://bbppmpvbmti.kemdikbud.go.id/main/" className="block py-2" onClick={() => setIsMobileOpen(false)}>
            Home
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;