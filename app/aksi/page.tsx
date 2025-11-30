import Navbar from '@/components/layout/NavbarAksi';
import { HeroAksi } from '@/components/sections/HeroAksi';
import { AksiOptions } from '@/components/sections/KanalAduan';
import { TimelineGratifikasi } from '@/components/sections/TimelineGratifikasi';
import { GratifikasiForm } from '@/components/forms/GratifikasiForm';

import FooterComponent from '@/components/layout/Footer';

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
      <GratifikasiForm />
      <FooterComponent />
    </>
  );
}