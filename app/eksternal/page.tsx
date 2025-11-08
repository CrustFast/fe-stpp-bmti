import Navbar from '@/components/common/NavbarSigap';
import { LayananInformasi } from '@/components/common/HeroSigap';

import FooterComponent from '@/layouts/Footer';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontrol Benturan Kepentingan Sistematis | KONFES',
  description: 'Kontrol Benturan Kepentingan Sistematis',
};

export default function ManfaatPage() {
  return (
    <>
      <Navbar />
      <LayananInformasi />
      <FooterComponent />
    </>
  );
}