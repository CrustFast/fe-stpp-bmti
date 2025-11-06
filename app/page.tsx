'use client';

import React from 'react';
import Navbar from '@/components/common/Navbar'
import HeroSection from '@/components/common/HeroComponent';
import Pengaduan from '@/components/common/PengaduanComponent'


const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Pengaduan />
    </>
  );
};

export default HomePage;