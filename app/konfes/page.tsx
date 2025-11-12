import Navbar from '@/components/common/NavbarKonfes';
import { HeroAksi } from '@/components/common/HeroKonfes';
import { BenturanKepentinganForm } from '@/components/common/BenturanKepentinganForm';
import FooterComponent from '@/layouts/Footer';

export default function ManfaatPage() {
  const unitKerjaOptions = [
    { id: '1', nama_unit: 'Unit A' },
    { id: '2', nama_unit: 'Unit B' },
  ];
  const jenisBenturanOptions = [
    { kode_id: '1', jenis_benturan_kepentingan: 'Nepotisme' },
    { kode_id: '2', jenis_benturan_kepentingan: 'Gratifikasi' },
  ];

  return (
    <>
      <Navbar />
      <HeroAksi />
      <BenturanKepentinganForm
        unitKerjaOptions={unitKerjaOptions}
        jenisBenturanOptions={jenisBenturanOptions}
      />
      <FooterComponent />
    </>
  );
}