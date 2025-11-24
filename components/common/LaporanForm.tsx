'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import React from 'react';
import { FilePondUploader } from '@/components/ui/FilePondUploader';
import { PUBLIC_API_BASE } from '@/lib/api';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Control, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const klasifikasiOptions = ['pengaduan', 'permintaan-informasi', 'saran'] as const;

const formSchema = z.object({
  klasifikasi_laporan: z
    .enum(klasifikasiOptions)
    .nullable()
    .refine((val) => val != null, {
      message: 'Pilih klasifikasi laporan.',
    }),

  // PENGADUAN
  tanggal_pengaduan: z.date().optional(),
  jenis_layanan: z.enum(['diklat', 'non-diklat']).optional(),
  tipe: z.string().optional(),
  kategori_pengaduan_id: z.string().optional(),
  isi_laporan_pengaduan: z.string().optional(),

  // Peserta Diklat
  periode_diklat_mulai: z.date().optional(),
  periode_diklat_akhir: z.date().optional(),
  nama_diklat: z.string().optional(),
  nama_peserta_diklat: z.string().optional(),
  nomor_telepon_peserta_diklat: z.string().optional(),
  asal_smk_peserta_diklat: z.string().optional(),
  program_keahlian: z.string().optional(),

  // Peserta PKL
  periode_magang_mulai: z.date().optional(),
  periode_magang_akhir: z.date().optional(),
  nama_peserta_pkl: z.string().optional(),
  nomor_telepon_peserta_pkl: z.string().optional(),
  asal_smk_peserta_pkl: z.string().optional(),
  unit: z.string().optional(),

  // Pengguna Fasilitas
  tanggal_penggunaan_mulai: z.date().optional(),
  tanggal_penggunaan_akhir: z.date().optional(),
  nama_pengguna_fasilitas: z.string().optional(),
  nomor_telepon_pengguna_fasilitas: z.string().optional(),
  email_pengguna_fasilitas: z.string().email().optional().or(z.literal('')),
  nama_fasilitas: z.string().optional(),

  // Masyarakat Umum
  nama_masyarakat_umum: z.string().optional(),
  nomor_telepon_masyarakat_umum: z.string().optional(),
  email_masyarakat_umum: z.string().email().optional().or(z.literal('')),
  alamat_masyarakat_umum: z.string().optional(),

  // Permintaan Informasi
  nama_peminta_informasi: z.string().optional(),
  nomor_telepon_peminta_informasi: z.string().optional(),
  email_peminta_informasi: z.string().email().optional().or(z.literal('')),
  isi_laporan_permintaan_informasi: z.string().optional(),

  // Saran
  nama_aduan_informasi: z.string().optional(),
  nomor_telepon_aduan_saran: z.string().optional(),
  email_aduan_saran: z.string().email().optional().or(z.literal('')),
  isi_laporan_saran: z.string().optional(),

  privasi: z.enum(['anonim', 'rahasia']).optional(),

  bukti_foto: z.array(z.instanceof(File).refine(f => /^(image\/.*|application\/pdf)$/.test(f.type), 'Hanya gambar atau PDF')).max(10).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const tipeOptions = {
  diklat: [
    { value: 'daring', label: 'Daring' },
    { value: 'luring', label: 'Luring' },
    { value: 'hybrid', label: 'Hybrid' },
  ],
  'non-diklat': [
    { value: 'pkl', label: 'PKL' },
    { value: 'pengguna-fasilitas', label: 'Pengguna Fasilitas' },
    { value: 'kunjungan', label: 'Masyarakat Umum' },
  ],
};

const fasilitasOptions = [
  { value: 'kolam', label: 'Kolam' },
  { value: 'bale-pancaniti', label: 'Bale Pancaniti' },
  { value: 'bale-binangkit', label: 'Bale Binangkit' },
];

const kategoriOptions = [
  { value: 'SKM1', label: 'Kesesuaian persyaratan pelayanan' },
  { value: 'SKM2', label: 'Kemudahan Prosedur' },
  { value: 'SKM3', label: 'Kecepatan Pelayanan' },
  { value: 'SKM4', label: 'Biaya/tarif pelayanan' },
  { value: 'SKM5', label: 'Kesesuaian Produk' },
  { value: 'SKM6', label: 'Perilaku Petugas' },
  { value: 'SKM7', label: 'Kompetensi/kemampuan petugas' },
  { value: 'SKM8', label: 'Penanganan Pengaduan' },
  { value: 'SKM9', label: 'Kualitas sarana dan prasarana' },
];

const programKeahlianOptions = [
  { value: '0', label: 'Tata Usaha dan Rumah Tangga' },
  { value: '1', label: 'Teknik Sipil dan Perencanaan' },
  { value: '2', label: 'Teknik Pemesinan' },
  { value: '3', label: 'Elektronika dan Informatika' },
  { value: '4', label: 'Ketenagalistrikan' },
  { value: '5', label: 'Otomotif' },
  { value: '6', label: 'Las dan Fabrikasi Logam' },
  { value: '7', label: 'Teknik Energi Terbarukan' },
  { value: '8', label: 'Pengajaran Umum' },
  { value: '9', label: 'Perencanaan dan Penganggaran' },
  { value: '10', label: 'Tata Laksana dan Kepegawaian' },
  { value: '11', label: 'Penjaminan Mutu Pendidikan Vokasi' },
  { value: '12', label: 'Fasilitas dan Peningkatan Kompetensi' },
  { value: '13', label: 'Penyelarasan dan Kerja Sama DU/DI' },
  { value: '14', label: 'Data Informasi Publikasi' },
];

const DATE_FIELDS: (keyof FormSchema)[] = [
  'tanggal_pengaduan',
  'periode_diklat_mulai',
  'periode_diklat_akhir',
  'periode_magang_mulai',
  'periode_magang_akhir',
  'tanggal_penggunaan_mulai',
  'tanggal_penggunaan_akhir',
];

const DRAFT_KEY = 'laporanForm:draft';
const LAST_PATH_KEY = 'laporanForm:lastPath';

export function LaporanForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      klasifikasi_laporan: null, 
  
      // PENGADUAN umum
      tanggal_pengaduan: undefined,
      jenis_layanan: undefined,
      tipe: undefined,
      kategori_pengaduan_id: undefined,
      isi_laporan_pengaduan: '',
      privasi: undefined,
  
      // Diklat
      periode_diklat_mulai: undefined,
      periode_diklat_akhir: undefined,
      nama_diklat: '',
      nama_peserta_diklat: '',
      nomor_telepon_peserta_diklat: '',
      asal_smk_peserta_diklat: '',
      program_keahlian: '',
  
      // PKL
      periode_magang_mulai: undefined,
      periode_magang_akhir: undefined,
      nama_peserta_pkl: '',
      nomor_telepon_peserta_pkl: '',
      asal_smk_peserta_pkl: '',
      unit: '',
  
      // Pengguna fasilitas
      tanggal_penggunaan_mulai: undefined,
      tanggal_penggunaan_akhir: undefined,
      nama_pengguna_fasilitas: '',
      nomor_telepon_pengguna_fasilitas: '',
      email_pengguna_fasilitas: '',
      nama_fasilitas: '',
  
      // Masyarakat umum (kunjungan)
      nama_masyarakat_umum: '',
      nomor_telepon_masyarakat_umum: '',
      email_masyarakat_umum: '',
      alamat_masyarakat_umum: '',
  
      // Permintaan informasi
      nama_peminta_informasi: '',
      nomor_telepon_peminta_informasi: '',
      email_peminta_informasi: '',
      isi_laporan_permintaan_informasi: '',
  
      // Saran
      nama_aduan_informasi: '',
      nomor_telepon_aduan_saran: '',
      email_aduan_saran: '',
      isi_laporan_saran: '',
  
      // Lampiran
      bukti_foto: [],
    },
  });

  const router = useRouter();

  const { watch, setValue } = form;
  const klasifikasi = watch('klasifikasi_laporan');
  const jenisLayanan = watch('jenis_layanan');
  const tipe = watch('tipe');
  const privasi = watch('privasi');
  const [openTanggalPengaduan, setOpenTanggalPengaduan] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null;
      if (raw) {
        const data = JSON.parse(raw) as Partial<Record<keyof FormSchema, unknown>>;
        DATE_FIELDS.forEach(f => {
          const v = data[f];
          if (typeof v === 'string') {
            const d = new Date(v);
            if (!isNaN(d.getTime())) {
              data[f] = d; 
            }
          }
        });
        form.reset({ ...form.getValues(), ...(data as Partial<FormSchema>) });
      }
    } catch {
      /* ignore */
    }
  }, [form]);

  //autosave form
  React.useEffect(() => {
    type DraftData = {
      [K in keyof FormSchema]:
        FormSchema[K] extends Date | undefined ? string | undefined : FormSchema[K];
    };
    const sub = watch(values => {
      try {
        const draft: DraftData = Object.fromEntries(
          Object.entries(values).map(([k, v]) => {
            if (
              DATE_FIELDS.includes(k as keyof FormSchema) &&
              v instanceof Date
            ) {
              return [k, v.toISOString()];
            }
            return [k, v];
          })
        ) as DraftData;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        localStorage.setItem(LAST_PATH_KEY, window.location.pathname);
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setValue('tipe', undefined);
  }, [jenisLayanan, setValue]);

  useEffect(() => {
    if (tipe === 'kunjungan') {
      if (privasi === 'anonim') {
        setValue('nama_masyarakat_umum', 'Anonim');
      } else if (privasi === 'rahasia' && watch('nama_masyarakat_umum') === 'Anonim') {
        setValue('nama_masyarakat_umum', '');
      }
    }
  }, [privasi, tipe, setValue, watch]);

  function toDateStr(d?: Date) {
    return d ? format(d, 'yyyy-MM-dd') : undefined;
  }

  function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const s = String(reader.result);
        resolve(s.includes(',') ? s.split(',')[1] : s);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function compact<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')
    ) as T;
  }

  async function onSubmit(values: FormSchema) {
    try {
      const files = values.bukti_foto ?? [];
      const bukti_foto_base64 = files.length
        ? await Promise.all(files.map(fileToBase64))
        : undefined;

      const payload = compact({
        // --- Umum ---
        klasifikasi_laporan: values.klasifikasi_laporan!,
        tanggal_pengaduan: toDateStr(values.tanggal_pengaduan),
        jenis_layanan: values.jenis_layanan,
        tipe: values.tipe,
        kategori_pengaduan_id: values.kategori_pengaduan_id,
        isi_laporan_pengaduan: values.isi_laporan_pengaduan,

        // --- diklat ---
        periode_diklat_mulai: toDateStr(values.periode_diklat_mulai),
        periode_diklat_akhir: toDateStr(values.periode_diklat_akhir),
        nama_diklat: values.nama_diklat,
        nama_peserta_diklat: values.nama_peserta_diklat,
        nomor_telepon_peserta_diklat: values.nomor_telepon_peserta_diklat,
        asal_smk_peserta_diklat: values.asal_smk_peserta_diklat,
        program_keahlian: values.program_keahlian,

        // --- pkl ---
        periode_magang_mulai: toDateStr(values.periode_magang_mulai),
        periode_magang_akhir: toDateStr(values.periode_magang_akhir),
        nama_peserta_pkl: values.nama_peserta_pkl,
        nomor_telepon_peserta_pkl: values.nomor_telepon_peserta_pkl,
        asal_smk_peserta_pkl: values.asal_smk_peserta_pkl,
        unit: values.unit,

        // --- pengguna fasilitas ---
        tanggal_penggunaan_mulai: toDateStr(values.tanggal_penggunaan_mulai),
        tanggal_penggunaan_akhir: toDateStr(values.tanggal_penggunaan_akhir),
        nama_pengguna_fasilitas: values.nama_pengguna_fasilitas,
        nomor_telepon_pengguna_fasilitas: values.nomor_telepon_pengguna_fasilitas,
        email_pengguna_fasilitas: values.email_pengguna_fasilitas,
        nama_fasilitas: values.nama_fasilitas,

        // --- masyarakat umum ---
        nama_masyarakat_umum: values.nama_masyarakat_umum,
        nomor_telepon_masyarakat_umum: values.nomor_telepon_masyarakat_umum,
        email_masyarakat_umum: values.email_masyarakat_umum,
        alamat_masyarakat_umum: values.alamat_masyarakat_umum,

        // --- permintaan informasi ---
        nama_peminta_informasi: values.nama_peminta_informasi,
        nomor_telepon_peminta_informasi: values.nomor_telepon_peminta_informasi,
        email_peminta_informasi: values.email_peminta_informasi,
        isi_laporan_permintaan_informasi: values.isi_laporan_permintaan_informasi,

        // --- saran ---
        nama_aduan_informasi: values.nama_aduan_informasi,
        nomor_telepon_aduan_saran: values.nomor_telepon_aduan_saran,
        email_aduan_saran: values.email_aduan_saran,
        isi_laporan_saran: values.isi_laporan_saran,

        // --- lampiran & privasi ---
        privasi: values.privasi,
        bukti_foto_base64,
      });

      const res = await fetch(`${PUBLIC_API_BASE}/api/laporan/dumas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json && json.success === false)) {
        throw new Error(json?.message || 'Gagal mengirim laporan');
      }

      toast.success('Laporan Terkirim!', { description: 'Mengalihkan ke halaman sukses...' });
      form.reset();
      //untuk membersihkan draft setelah sukses
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(LAST_PATH_KEY);
      router.push('/success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error('Gagal mengirim laporan', { description: message });
      const q = new URLSearchParams({ error: message }).toString();
      router.push(`/failed?${q}`);
    }
  }

  return (
    <div id="laporanForm" className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-blue-bmti sm:text-4xl">
          Lengkapi Data dan Tuliskan Pengaduan
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-3 max-w-xl sm:mt-20 bg-white shadow-xl rounded-lg p-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="klasifikasi_laporan"
              render={({ field }) => (
                <FormItem className="space-y-3 sm:col-span-2">
                  <FormLabel className="block w-full text-base font-bold leading-6 text-gray-900 text-center">
                    Pilih Klasifikasi Laporan
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col sm:flex-row gap-x-3 gap-y-3 mb-4 pb-2 items-start sm:items-center sm:justify-center text-left"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="pengaduan"
                            className="cursor-pointer border-blue-500 data-[state=checked]:bg-white data-[state=checked]:border-blue-500 focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Pengaduan</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="permintaan-informasi"
                            className="cursor-pointer border-blue-500 data-[state=checked]:bg-white data-[state=checked]:border-blue-500 focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Permintaan Konsultasi</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="saran"
                            className="cursor-pointer border-blue-500 data-[state=checked]:bg-white data-[state=checked]:border-blue-500 focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Saran</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {klasifikasi === 'pengaduan' && (
              <>
                <FormField
                  control={form.control}
                  name="tanggal_pengaduan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. Tanggal Pengaduan <span className="text-red-600">*</span></FormLabel>
                      <Popover open={openTanggalPengaduan} onOpenChange={setOpenTanggalPengaduan}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              onClick={() => setOpenTanggalPengaduan(true)}
                              className={cn(
                                'h-11 w-full pl-3 pr-3 py-0 items-center text-left font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-500/60',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'dd MMMM yyyy', { locale: id }) : <span>Pilih tanggal</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={id}
                            mode="single"
                            selected={field.value}
                            onSelect={(d) => {
                              if (d) {
                                field.onChange(d);
                                setOpenTanggalPengaduan(false);
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jenis_layanan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Jenis Layanan <span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-500/60">
                            <SelectValue placeholder="Pilih Jenis Layanan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="diklat">Diklat</SelectItem>
                          <SelectItem value="non-diklat">Non Diklat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. Tipe <span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-500/60">
                            <SelectValue placeholder="Pilih Tipe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(jenisLayanan ? tipeOptions[jenisLayanan as 'diklat' | 'non-diklat'] : []).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kategori_pengaduan_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. Kategori Pengaduan <span className="text-red-600">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-blue-500/60">
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kategoriOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {tipe === 'daring' || tipe === 'luring' || tipe === 'hybrid' ? (
                  <>
                    <DateRangeField
                      label="Periode Diklat"
                      startName="periode_diklat_mulai"
                      endName="periode_diklat_akhir"
                      control={form.control}
                      className="mt-6"
                    />
                    <FormField control={form.control} name="nama_diklat" render={({ field }) => <InputField label="Nama Diklat" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="nama_peserta_diklat" render={({ field }) => <InputField label="Nama Peserta" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="nomor_telepon_peserta_diklat" render={({ field }) => <InputField label="Nomor Telepon Peserta Diklat" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="asal_smk_peserta_diklat" render={({ field }) => <InputField label="Asal SMK" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField
                      control={form.control}
                      name="program_keahlian"
                      render={({ field }) => (
                        <SelectField
                          label="Program Keahlian"
                          placeholder="Pilih Program Keahlian"
                          options={programKeahlianOptions}
                          className="sm:col-span-2 mt-6"
                          contentClassName="max-h-64 overflow-y-auto"
                          {...field}
                        />
                      )}
                    />
                  </>
                ) : tipe === 'pkl' ? (
                  <>
                    <DateRangeField label="Periode Magang" startName="periode_magang_mulai" endName="periode_magang_akhir" control={form.control} className="mt-6" />
                    <FormField control={form.control} name="nama_peserta_pkl" render={({ field }) => <InputField label="Nama Peserta PKL" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="nomor_telepon_peserta_pkl" render={({ field }) => <InputField label="Nomor Telepon Peserta PKL" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="asal_smk_peserta_pkl" render={({ field }) => <InputField label="Asal SMK/Perguruan Tinggi" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="unit" render={({ field }) => <InputField label="Unit" placeholder="Masukkan Tempat Kalian Magang" className="sm:col-span-2 mt-6" {...field} />} />
                  </>
                ) : tipe === 'pengguna-fasilitas' ? (
                  <>
                    <DateRangeField label="Tanggal Penggunaan" startName="tanggal_penggunaan_mulai" endName="tanggal_penggunaan_akhir" control={form.control} className="mt-6" />
                    <FormField control={form.control} name="nama_pengguna_fasilitas" render={({ field }) => <InputField label="Nama Pengguna Fasilitas" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="nomor_telepon_pengguna_fasilitas" render={({ field }) => <InputField label="Nomor Telepon Pengguna" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="email_pengguna_fasilitas" render={({ field }) => <InputField label="Email Pengguna" type="email" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField
                      control={form.control}
                      name="nama_fasilitas"
                      render={({ field }) => (
                        <SelectField label="Fasilitas yang digunakan" placeholder="Pilih Fasilitas" options={fasilitasOptions} className="sm:col-span-2 mt-6" {...field} />
                      )}
                    />
                  </>
                ) : tipe === 'kunjungan' ? (
                  <>
                    <PrivasiRadio control={form.control} className="sm:col-span-2 mt-2" />
                    <FormField
                      control={form.control}
                      name="nama_masyarakat_umum"
                      render={({ field }) => (
                        <InputField
                          label={privasi === 'anonim' ? 'Anonim' : 'Nama'}
                          className="sm:col-span-2 mt-6"
                          readOnly={privasi === 'anonim'}
                          value={privasi === 'anonim' ? 'Anonim' : field.value}
                          onChange={privasi === 'anonim' ? undefined : field.onChange}
                        />
                      )}
                    />
                    <FormField control={form.control} name="nomor_telepon_masyarakat_umum" render={({ field }) => <InputField label="Nomor Telepon" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField control={form.control} name="email_masyarakat_umum" render={({ field }) => <InputField label="Email" type="email" className="sm:col-span-2 mt-6" {...field} />} />
                    <FormField
                      control={form.control}
                      name="alamat_masyarakat_umum"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2 mt-6">
                          <FormLabel>Alamat (opsional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Alamat"
                              rows={3}
                              className="border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}

                <FormField
                  control={form.control}
                  name="isi_laporan_pengaduan"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>5. Isi Pengaduan <span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ketik Isi Laporan Anda"
                          rows={4}
                          className="border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {klasifikasi === 'permintaan-informasi' && (
              <>
                <div className="rounded-md bg-red-50 p-4 sm:col-span-2">
                  <p className="text-sm text-red-800">
                    Terkait permintaan informasi, silahkan kunjungi website PPID kami di{' '}
                    <a href="https://bbppmpvbmti.kemendikdasmen.go.id/Ppid/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                      www.bbppmpvbmti.kemendikdasmen.go.id/Ppid/
                    </a>
                    .
                  </p>
                </div>

                <FormField control={form.control} name="nama_peminta_informasi" render={({ field }) => <InputField label="Nama" className="sm:col-span-2" {...field} />} />
                <FormField control={form.control} name="nomor_telepon_peminta_informasi" render={({ field }) => <InputField label="Nomor Telepon" className="sm:col-span-2" {...field} />} />
                <FormField control={form.control} name="email_peminta_informasi" render={({ field }) => <InputField label="Email" type="email" className="sm:col-span-2" {...field} />} />
                <FormField
                  control={form.control}
                  name="isi_laporan_permintaan_informasi"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Detail Keperluan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detail Keperluan"
                          rows={4}
                          className="border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            {klasifikasi === 'saran' && (
              <>
                <FormField control={form.control} name="nama_aduan_informasi" render={({ field }) => <InputField label="Nama" className="sm:col-span-2" {...field} />} />
                <FormField control={form.control} name="nomor_telepon_aduan_saran" render={({ field }) => <InputField label="Nomor Telepon" className="sm:col-span-2" {...field} />} />
                <FormField control={form.control} name="email_aduan_saran" render={({ field }) => <InputField label="Email" type="email" className="sm:col-span-2" {...field} />} />
                <FormField
                  control={form.control}
                  name="isi_laporan_saran"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Isi Saran</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ketik Isi Saran Anda"
                          rows={4}
                          className="border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            {klasifikasi === 'pengaduan' && (
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="bukti_foto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto Sebagai Bukti Pendukung (opsional)</FormLabel>
                      <FormControl>
                        <FilePondUploader
                          control={form.control}
                          name="bukti_foto"
                          helperText="Maksimal 10 file, format JPG/PNG/WebP atau PDF"
                          maxFiles={10}
                          allowMultiple
                          acceptedFileTypes={['image/*', 'application/pdf']}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="mt-10">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-500 text-white cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only">Mengirim...</span>
                </span>
              ) : (klasifikasi === 'pengaduan' ? 'ADUKAN!' : 'KIRIM!')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function InputField({ label, className, readOnly, type, placeholder, value, onChange, ...rest }: InputFieldProps) {
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type={type}
          readOnly={readOnly}
          placeholder={placeholder ?? ' '}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-11 py-2.5
                     border border-blue-500/60
                     focus:border-blue-500
                     focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0
                     focus-visible:outline-none
                     focus:text-blue-500
                     shadow-none"
          {...rest}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<ControllerRenderProps<FieldValues, string>, 'ref'> {
  label: string;
  placeholder: string;
  options: SelectOption[];
  className?: string;
  contentClassName?: string; 
}

function SelectField({ label, placeholder, options, className, onChange, value, contentClassName }: SelectFieldProps) {
  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const canScroll = el.scrollHeight > el.clientHeight;
    if (!canScroll) return;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
      e.preventDefault();
    }
  };

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <Select onValueChange={onChange} defaultValue={value}>
        <FormControl>
          <SelectTrigger className="w-full h-11 border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent
          className={cn('max-h-56 overflow-y-auto', contentClassName)}
          onWheel={handleWheel}
        >
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

interface DateRangeFieldProps {
  label: string;
  startName: keyof FormSchema;
  endName: keyof FormSchema;
  control: Control<FormSchema>;
  className?: string;
}

function DateRangeField({ label, startName, endName, control, className }: DateRangeFieldProps) {
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);
  return (
    <div className={cn('sm:col-span-2', className)}>
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-col gap-3 mt-2">
        <FormField
          control={control}
          name={startName}
          render={({ field }) => (
            <Popover open={openStart} onOpenChange={setOpenStart}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setOpenStart(true)}
                  className={cn(
                    'h-11 w-full pl-3 pr-3 py-0 items-center text-left font-normal',
                    'border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500',
                    field.value ? 'text-black rounded-md' : 'text-black'
                  )}
                >
                  {field.value && field.value instanceof Date ? format(field.value, 'dd MMMM yyyy', { locale: id }) : 'Mulai'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  locale={id}
                  mode="single"
                  selected={field.value instanceof Date ? field.value : undefined}
                  onSelect={(d) => {
                    if (d) {
                      field.onChange(d);
                      setOpenStart(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        <span className="text-gray-500 text-center text-sm">or</span>
        <FormField
          control={control}
          name={endName}
          render={({ field }) => (
            <Popover open={openEnd} onOpenChange={setOpenEnd}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setOpenEnd(true)}
                  className={cn(
                    'h-11 w-full pl-3 pr-3 py-0 items-center text-left font-normal',
                    'border-blue-500/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-blue-500',
                    field.value ? 'text-black rounded-md' : 'text-black'
                  )}
                >
                  {field.value && field.value instanceof Date ? format(field.value, 'dd MMMM yyyy', { locale: id }) : 'Akhir'}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  locale={id}
                  mode="single"
                  selected={field.value instanceof Date ? field.value : undefined}
                  onSelect={(d) => {
                    if (d) {
                      field.onChange(d);
                      setOpenEnd(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
}

interface PrivasiRadioProps {
  control: Control<FormSchema>;
  className?: string;
}

function PrivasiRadio({ control, className }: PrivasiRadioProps) {
  return (
    <FormField
      control={control}
      name="privasi"
      render={({ field }) => (
        <FormItem className={cn("flex gap-4 items-center", className)}>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anonim" id="anonim" />
                <FormLabel htmlFor="anonim" className="font-normal cursor-pointer">
                  Anonim
                  <span className="block text-xs text-gray-500">Nama tidak dipublikasikan</span>
                </FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rahasia" id="rahasia" />
                <FormLabel htmlFor="rahasia" className="font-normal cursor-pointer">
                  Rahasia
                  <span className="block text-xs text-gray-500">Hanya petugas yang tahu</span>
                </FormLabel>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}