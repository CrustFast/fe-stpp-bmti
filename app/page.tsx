'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroComponent';
import Pengaduan from '@/components/sections/PengaduanComponent';
import Panduan from '@/components/sections/PanduanComponent';
import CekStatusComponent from '@/components/sections/CekStatusComponent';
import ManfaatComponent from '@/components/sections/ManfaatComponent';
import FooterComponent from '@/components/layout/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Pengaduan />
      <Panduan />
      <CekStatusComponent />
      <ManfaatComponent />
      <FooterComponent />
    </>
  );
};

export default HomePage;