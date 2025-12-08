import Navbar from '@/components/layout/NavbarKonfes';
import { HeroAksi } from '@/components/sections/HeroKonfes';
import { LaporanOptions } from '@/components/sections/KanalAduanKonfes';
import { TimelineKonfes } from '@/components/sections/TimelineKonfes';
import { BenturanKepentinganForm } from '@/components/forms/BenturanKepentinganForm';
import FooterComponent from '@/components/layout/Footer';

export default function ManfaatPage() {
  return (
    <>
      <Navbar />
      <HeroAksi />
      <LaporanOptions />
      <TimelineKonfes />
      <BenturanKepentinganForm />
      <FooterComponent />
    </>
  );
}