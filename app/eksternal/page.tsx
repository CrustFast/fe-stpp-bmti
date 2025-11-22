'use client';
import { useLayoutEffect } from 'react';
import Navbar from '@/components/common/NavbarSigap';
import { LayananInformasi } from '@/components/common/HeroSigap';
import { LaporanForm } from '@/components/common/LaporanForm';
import FooterComponent from '@/layouts/Footer';

export default function ManfaatPage() {
  useLayoutEffect(() => {
    const intent = sessionStorage.getItem('goToLaporanForm');
    window.scrollTo(0, 0);
    if (intent === '1') {
      sessionStorage.removeItem('goToLaporanForm');
      requestAnimationFrame(() => {
        const el = document.getElementById('laporanForm');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <LayananInformasi />
      <LaporanForm />
      <FooterComponent />
    </>
  );
}