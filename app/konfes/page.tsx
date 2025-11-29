import Navbar from '@/components/common/NavbarKonfes';
import { HeroAksi } from '@/components/common/HeroKonfes';
import { BenturanKepentinganForm } from '@/components/common/BenturanKepentinganForm';
import FooterComponent from '@/layouts/Footer';

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