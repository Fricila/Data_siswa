import { useEffect, useState } from 'react';
import { api } from './api';
import SiswaTable from './components/SiswaTable.jsx';
import SiswaForm from './components/SiswaForm.jsx';

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formAwal, setFormAwal] = useState(null); // null = tertutup, {} = tambah, objek = ubah
  const [pesan, setPesan] = useState('');

  async function muat(kata = q) {
    try {
      setError('');
      setSiswa(await api.list(kata));
    } catch (e) {
      setError('Gagal memuat data. Pastikan server backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  }

  // Muat ulang saat kata kunci berubah (dengan jeda singkat)
  useEffect(() => {
    const t = setTimeout(() => muat(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(''), 3000);
  }

  async function simpan(data) {
    if (formAwal?.id) {
      await api.update(formAwal.id, data);
      tampilkanPesan('Data siswa berhasil diperbarui.');
    } else {
      await api.create(data);
      tampilkanPesan('Data siswa berhasil ditambahkan.');
    }
    setFormAwal(null);
    muat();
  }

  async function hapus(s) {
    if (!window.confirm(`Hapus data siswa "${s.nama_siswa}" (${s.kode_siswa})? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await api.remove(s.id);
      tampilkanPesan('Data siswa berhasil dihapus.');
      muat();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="halaman">
      <header className="kepala">
        <div className="judul-area">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <h1>Data Siswa</h1>
            <p className="sub">
              {loading
                ? 'Memuat data…'
                : `${siswa.length} siswa terdaftar${q ? ` untuk pencarian “${q}”` : ''}`}
            </p>
          </div>
        </div>
        <button className="tombol utama" onClick={() => setFormAwal({})}>
          <span className="plus-icon">+</span> Tambah Siswa
        </button>
      </header>

      <div className="kontrol-bar">
        <div className="cari-wrapper">
          <svg className="cari-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="cari"
            type="search"
            placeholder="Cari kode, nama, jurusan, atau alamat siswa…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari siswa"
          />
        </div>
      </div>

      {error && <div className="galat" role="alert">{error}</div>}

      {loading ? (
        <div className="kosong">
          <div className="spinner"></div>
          <p>Memuat data siswa…</p>
        </div>
      ) : siswa.length === 0 ? (
        <div className="kosong">
          <p className="kosong-judul">
            {q ? 'Tidak ada data siswa yang cocok.' : 'Belum ada data siswa.'}
          </p>
          <p className="kosong-desc">
            {q
              ? 'Coba gunakan kata kunci lain.'
              : 'Klik tombol "Tambah Siswa" untuk menambahkan data siswa baru.'}
          </p>
          {!q && (
            <button className="tombol utama" onClick={() => setFormAwal({})}>
              + Tambah Siswa Pertama
            </button>
          )}
        </div>
      ) : (
        <SiswaTable data={siswa} onUbah={setFormAwal} onHapus={hapus} />
      )}

      {formAwal && (
        <SiswaForm awal={formAwal} onSimpan={simpan} onBatal={() => setFormAwal(null)} />
      )}

      {pesan && <div className="toast" role="status">{pesan}</div>}
    </div>
  );
}
