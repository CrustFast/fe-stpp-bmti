'use client';

import React from 'react';
import Navbar from '@/components/common/Navbar';
import HeroSection from '@/components/common/HeroComponent';
import Pengaduan from '@/components/common/PengaduanComponent';
import Panduan from '@/components/common/PanduanComponent';
import CekStatusComponent from '@/components/common/CekStatusComponent';
import ManfaatComponent from '@/components/common/ManfaatComponent';
import FooterComponent from '@/layouts/Footer';

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