import Navbar from '@/components/common/NavbarKonfes';
import { HeroAksi } from '@/components/common/HeroKonfes';

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
      <HeroAksi />
      <FooterComponent />
    </>
  );
}