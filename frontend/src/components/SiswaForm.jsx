import { useState } from 'react';

const KOSONG = {
  kode_siswa: '',
  nama_siswa: '',
  alamat_siswa: '',
  tanggal_siswa: '',
  jurusan_siswa: '',
};

export default function SiswaForm({ awal, onSimpan, onBatal }) {
  const ubah = Boolean(awal?.id);
  const [v, setV] = useState({
    ...KOSONG,
    ...Object.fromEntries(Object.entries(awal || {}).map(([k, val]) => [k, val ?? ''])),
  });
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    setMenyimpan(true);
    try {
      await onSimpan(v);
    } catch (err) {
      setGalat(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <div className="latar" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <form className="modal" onSubmit={kirim}>
        <div className="modal-header">
          <h2>{ubah ? 'Ubah Data Siswa' : 'Tambah Data Siswa'}</h2>
          <button type="button" className="tombol-tutup" onClick={onBatal} title="Tutup">
            &times;
          </button>
        </div>

        <div className="baris">
          <label>
            <span>Kode Siswa <span className="wajib">*</span></span>
            <input
              value={v.kode_siswa}
              onChange={set('kode_siswa')}
              placeholder="Contoh: SIS-001"
              required
              autoFocus
            />
          </label>
          <label>
            <span>Jurusan Siswa <span className="wajib">*</span></span>
            <input
              list="daftar-jurusan"
              value={v.jurusan_siswa}
              onChange={set('jurusan_siswa')}
              placeholder="Contoh: Rekayasa Perangkat Lunak"
              required
            />
            <datalist id="daftar-jurusan">
              <option value="Rekayasa Perangkat Lunak" />
              <option value="Teknik Komputer & Jaringan" />
              <option value="Desain Komunikasi Visual" />
              <option value="Multimedia" />
              <option value="Akuntansi & Keuangan" />
              <option value="Manajemen Perkantoran" />
              <option value="Teknik Bisnis Sepeda Motor" />
              <option value="Teknik Kendaraan Ringan" />
            </datalist>
          </label>
        </div>

        <label>
          <span>Nama Siswa <span className="wajib">*</span></span>
          <input
            value={v.nama_siswa}
            onChange={set('nama_siswa')}
            placeholder="Masukkan nama lengkap siswa"
            required
          />
        </label>

        <label>
          <span>Tanggal Siswa</span>
          <input
            type="date"
            value={v.tanggal_siswa}
            onChange={set('tanggal_siswa')}
          />
        </label>

        <label>
          <span>Alamat Siswa</span>
          <textarea
            rows="3"
            value={v.alamat_siswa}
            onChange={set('alamat_siswa')}
            placeholder="Masukkan alamat domisili siswa"
          />
        </label>

        {galat && <div className="galat" role="alert">{galat}</div>}

        <div className="tombol-form">
          <button type="button" className="tombol" onClick={onBatal}>
            Batal
          </button>
          <button type="submit" className="tombol utama" disabled={menyimpan}>
            {menyimpan ? 'Menyimpan…' : ubah ? 'Perbarui Data' : 'Simpan Data'}
          </button>
        </div>
      </form>
    </div>
  );
}
