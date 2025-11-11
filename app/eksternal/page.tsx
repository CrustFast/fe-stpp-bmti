import Navbar from '@/components/common/NavbarSigap';
import { LayananInformasi } from '@/components/common/HeroSigap';
import { LaporanForm } from '@/components/common/LaporanForm';

import FooterComponent from '@/layouts/Footer';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layanan Pengaduan Eksternal | SIGAP',
  description: 'Layanan Pengaduan Eksternal',
};

export default function ManfaatPage() {
  return (
    <>
      <Navbar />
      <LayananInformasi />
      <LaporanForm />
      <FooterComponent />
    </>
  );
}