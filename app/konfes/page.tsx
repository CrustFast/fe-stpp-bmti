import Navbar from '@/components/layout/NavbarKonfes';
import { HeroAksi } from '@/components/sections/HeroKonfes';
import { BenturanKepentinganForm } from '@/components/forms/BenturanKepentinganForm';
import FooterComponent from '@/components/layout/Footer';

export default function ManfaatPage() {
  return (
    <>
      <Navbar />
      <HeroAksi />
      <BenturanKepentinganForm />
      <FooterComponent />
    </>
  );
}