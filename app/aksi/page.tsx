import Navbar from '@/components/common/NavbarAksi';
import { HeroAksi } from '@/components/common/HeroAksi';
import { AksiOptions } from '@/components/common/KanalAduan';
import { TimelineGratifikasi } from '@/components/common/TimelineGratifikasi';

import FooterComponent from '@/layouts/Footer';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aplikasi Kendali Laporan Gratifikasi | AKSI',
  description: 'Aplikasi Kendali Laporan Gratifikasi',
};

export default function ManfaatPage() {
  return (
    <>
      <Navbar />
      <HeroAksi />
      <AksiOptions />
      <TimelineGratifikasi />
      <FooterComponent />
    </>
  );
}