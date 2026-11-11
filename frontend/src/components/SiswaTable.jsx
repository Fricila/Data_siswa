function formatTanggal(t) {
  if (!t) return '-';
  try {
    const [y, m, d] = t.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return t;
  } catch {
    return t;
  }
}

export default function SiswaTable({ data, onUbah, onHapus }) {
  return (
    <div className="tabel-bungkus">
      <table>
        <thead>
          <tr>
            <th>Kode Siswa</th>
            <th>Nama Siswa</th>
            <th>Alamat Siswa</th>
            <th>Tanggal Siswa</th>
            <th>Jurusan Siswa</th>
            <th className="aksi-header">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.id}>
              <td className="kode-siswa">
                <span className="badge-kode">{s.kode_siswa}</span>
              </td>
              <td>
                <span className="nama-siswa">{s.nama_siswa}</span>
              </td>
              <td className="alamat-siswa">
                {s.alamat_siswa || <span className="kosong-teks">-</span>}
              </td>
              <td className="tanggal-siswa">
                {formatTanggal(s.tanggal_siswa)}
              </td>
              <td>
                <span className="badge-jurusan">{s.jurusan_siswa}</span>
              </td>
              <td className="aksi">
                <button
                  type="button"
                  className="tombol kecil edit"
                  onClick={() => onUbah(s)}
                  title="Ubah data"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="tombol kecil bahaya"
                  onClick={() => onHapus(s)}
                  title="Hapus data"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
