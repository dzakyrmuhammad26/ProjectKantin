import Link from 'next/link';

export const metadata = {
  title: 'Kantin POS — Sistem Pujasera Kasir Terpusat',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Sistem POS Pujasera Terpusat
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Kantin Multi-Gerai
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-lg">
            Satu kartu fisik (nomor 1–99), pesan dari stan manapun, dan bayar terpusat di kasir sentral.
          </p>
        </div>

        {/* 4 Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Pelanggan */}
          <Link
            href="/customer"
            prefetch={true}
            className="group p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Pelanggan / Guest
                </span>
                <span className="text-xs text-[#9CA3AF] group-hover:text-emerald-600 transition-colors">
                  Buka &rarr;
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#111827] group-hover:text-emerald-700 transition-colors">
                Menu & Pesan Mandiri
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
                Tampilan mobile grid 3 kolom kartu vertikal. Masukkan nomor kartu fisik 1–99 dan pesan dari berbagai stan.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F3F4F6] text-xs font-medium text-emerald-600">
              Rute: /customer
            </div>
          </Link>

          {/* 2. Gerai */}
          <Link
            href="/stall/queue"
            prefetch={true}
            className="group p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  Tenant / Stan
                </span>
                <span className="text-xs text-[#9CA3AF] group-hover:text-blue-600 transition-colors">
                  Buka &rarr;
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#111827] group-hover:text-blue-700 transition-colors">
                Tablet Dapur & Kelola Menu
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
                Antrean 3 kolom (Menunggu Bayar, Siap Dibuat, Selesai) serta akses CRUD penuh untuk katalog menu stan.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F3F4F6] text-xs font-medium text-blue-600">
              Rute: /stall/queue & /stall/menu
            </div>
          </Link>

          {/* 3. Kasir */}
          <Link
            href="/cashier"
            prefetch={true}
            className="group p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                  Kasir Sentral
                </span>
                <span className="text-xs text-[#9CA3AF] group-hover:text-amber-600 transition-colors">
                  Buka &rarr;
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#111827] group-hover:text-amber-700 transition-colors">
                Pelunasan & Struk Kasir
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
                Cari nomor kartu 1–99, agregasi tagihan multi-stan, terima tunai/QRIS, dan cetak struk otomatis.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F3F4F6] text-xs font-medium text-amber-700">
              Rute: /cashier
            </div>
          </Link>

          {/* 4. Superadmin */}
          <Link
            href="/admin/dashboard"
            prefetch={true}
            className="group p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md">
                  Superadmin
                </span>
                <span className="text-xs text-[#9CA3AF] group-hover:text-purple-600 transition-colors">
                  Buka &rarr;
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#111827] group-hover:text-purple-700 transition-colors">
                Dashboard & Manajemen Kantin
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
                Analitik omzet harian, kelola stan (tanpa rental mode), master menu seluruh stan, dan kelola akun staf & PIN.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F3F4F6] text-xs font-medium text-purple-700">
              Rute: /admin/dashboard
            </div>
          </Link>
        </div>

        {/* Footer info & Login Quick Link */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4 text-xs text-[#6B7280]">
          <span>Kantin POS Pujasera Frontend MVC Architecture</span>
          <Link
            href="/auth"
            className="font-semibold text-[#111827] hover:underline"
          >
            Login Staf via PIN &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
