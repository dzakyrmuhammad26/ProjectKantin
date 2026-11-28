import { Gerai } from '@/models/gerai';
import { Menu } from '@/models/menu';
import { DetailPembayaran, MetodePembayaran } from '@/models/pembayaran';
import { PengaturanKantin } from '@/models/pengaturan';
import { Pengguna } from '@/models/pengguna';
import { ItemPesanan, Pesanan } from '@/models/pesanan';
import { SesiPelanggan } from '@/models/sesi';

function formatWaktuWIB(dateValue?: string | Date | null): string {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}

export function normalizeMenuImage(foto?: string | null): string {
  if (!foto || foto === '/images/menu/placeholder.jpg') return '';
  return foto;
}

export function mapGerai(raw: any): Gerai {
  const id = raw.kode || raw._id || raw.id;
  return {
    id,
    kode: raw.kode || id,
    code: raw.kode || id,
    nama: raw.nama || '',
    name: raw.nama || '',
    penyewa: raw.penyewa || '',
    warna: raw.warna || '#F97316',
    color: raw.warna || '#F97316',
    aktif: raw.aktif !== false,
  };
}

export function mapMenu(raw: any): Menu {
  const id = raw._id || raw.id || raw.kode;
  const kode = raw.kode || id;
  const nama = raw.nama || '';
  const harga = Number(raw.harga ?? 0);
  const idGerai = raw.idGerai || '';
  const namaGerai = raw.namaGerai || '';
  const foto = normalizeMenuImage(raw.foto ?? raw.image);
  const isHabis = Boolean(raw.isHabis);

  return {
    id,
    kode,
    code: kode,
    nama,
    name: nama,
    harga,
    price: harga,
    idGerai,
    stallId: idGerai,
    namaGerai,
    stallName: namaGerai,
    kategori: raw.kategori || 'makanan',
    foto,
    image: foto,
    urutan: raw.urutan ?? 99,
    isFavorit: Boolean(raw.isFavorit),
    isHabis,
    isSoldOut: isHabis,
    aktif: raw.aktif !== false,
  };
}

export function mapPengguna(raw: any): Pengguna {
  return {
    id: raw._id || raw.id,
    nama: raw.nama || '',
    username: raw.username || '',
    pin: raw.pin || '****',
    peran: raw.peran || 'gerai',
    idGerai: raw.idGerai || undefined,
    aktif: raw.aktif !== false,
  };
}

export function mapSesi(raw: any): SesiPelanggan {
  return {
    id: raw.idSesi || raw._id || raw.id,
    nomorKartu: Number(raw.nomorKartu),
    nomorMeja: raw.nomorMeja ?? undefined,
    status: raw.status || 'aktif',
    totalTagihan: Number(raw.totalTagihan ?? 0),
    waktuBuka: formatWaktuWIB(raw.waktuBuka),
    waktuTutup: raw.waktuTutup ? formatWaktuWIB(raw.waktuTutup) : undefined,
  };
}

export function mapPembayaran(raw: any): DetailPembayaran {
  const metode = (raw.metode || raw.method || 'tunai') as MetodePembayaran;
  const uangDiterima = Number(raw.uangDiterima ?? raw.amountPaid ?? 0);
  const kembalian = Number(raw.kembalian ?? raw.change ?? 0);
  const waktuBayar = formatWaktuWIB(raw.waktuBayar || raw.paidAt);

  return {
    metode,
    method: metode,
    totalTagihan: Number(raw.totalTagihan ?? 0),
    uangDiterima,
    amountPaid: uangDiterima,
    kembalian,
    change: kembalian,
    waktuBayar,
    paidAt: waktuBayar,
    idKasir: raw.idKasir || undefined,
    referensiQris: raw.referensiQris || undefined,
  };
}

export function mapItemPesanan(raw: any): ItemPesanan {
  const menuObj: Menu = raw.menuItem
    ? mapMenu(raw.menuItem)
    : mapMenu({
        _id: raw.idMenu,
        kode: raw.idMenu,
        nama: raw.namaMenu,
        harga: raw.hargaSaatItu,
        idGerai: raw.idGerai || '',
        namaGerai: raw.namaGerai || '',
      });

  const jumlah = Number(raw.jumlah ?? raw.qty ?? 1);
  const hargaSaatItu = Number(raw.hargaSaatItu ?? menuObj.harga);
  const subtotal = Number(raw.subtotal ?? hargaSaatItu * jumlah);
  const catatan = raw.catatan ?? raw.notes ?? '';

  return {
    menu: menuObj,
    menuItem: menuObj,
    jumlah,
    qty: jumlah,
    catatan,
    notes: catatan,
    hargaSaatItu,
    subtotal,
  };
}

export function mapPesanan(raw: any): Pesanan {
  const id = raw.idPesanan || raw._id || raw.id;
  const nomorKartu = String(raw.nomorKartu || raw.cardNumber || '');
  const waktuPesan = formatWaktuWIB(raw.waktuPesan || raw.createdAt);
  const pembayaran = raw.pembayaran ? mapPembayaran(raw.pembayaran) : undefined;

  return {
    id,
    idSesi: raw.idSesi || undefined,
    nomorKartu,
    cardNumber: nomorKartu,
    nomorMeja: raw.nomorMeja ?? undefined,
    idGerai: raw.idGerai || undefined,
    namaGerai: raw.namaGerai || undefined,
    status: raw.status || 'menunggu_bayar',
    sumber: raw.sumber || 'pelanggan',
    items: Array.isArray(raw.items) ? raw.items.map(mapItemPesanan) : [],
    total: Number(raw.total ?? 0),
    waktuPesan,
    createdAt: waktuPesan,
    catatan: raw.catatan || undefined,
    pembayaran,
    payment: pembayaran,
  };
}

export function mapPengaturan(raw: any): PengaturanKantin {
  return {
    namaKantin: raw?.namaKantin || 'Kantin Sentral Pujasera',
    alamatKantin: raw?.alamatKantin || 'Gedung Kuliah Bersama Lt. 1',
    nomorKartuMin: Number(raw?.nomorKartuMin ?? 1),
    nomorKartuMax: Number(raw?.nomorKartuMax ?? 99),
    teksFooterStruk:
      raw?.teksFooterStruk || 'Terima kasih atas kunjungan Anda di Kantin Sentral!',
    metodeBayarAktif: Array.isArray(raw?.metodeBayarAktif)
      ? raw.metodeBayarAktif
      : ['tunai', 'qris', 'debit'],
  };
}
