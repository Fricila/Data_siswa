const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validasi input; mengembalikan { data } atau { error }
function validasi(body) {
  const data = {
    kode_siswa: String(body.kode_siswa ?? '').trim(),
    nama_siswa: String(body.nama_siswa ?? '').trim(),
    alamat_siswa: String(body.alamat_siswa ?? '').trim() || null,
    tanggal_siswa: String(body.tanggal_siswa ?? '').trim() || null,
    jurusan_siswa: String(body.jurusan_siswa ?? '').trim(),
  };

  if (!data.kode_siswa) return { error: 'Kode Siswa wajib diisi.' };
  if (!data.nama_siswa) return { error: 'Nama Siswa wajib diisi.' };
  if (!data.jurusan_siswa) return { error: 'Jurusan Siswa wajib diisi.' };
  return { data };
}

function tanganiError(err, res) {
  if (/UNIQUE constraint failed/i.test(err.message)) {
    return res.status(409).json({ message: 'Kode Siswa sudah terdaftar.' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}

// READ: semua siswa (opsional pencarian ?q=)
app.get('/api/siswa', (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const rows = q
    ? db
        .prepare(
          `SELECT * FROM siswa
           WHERE nama_siswa LIKE @q OR kode_siswa LIKE @q OR jurusan_siswa LIKE @q OR alamat_siswa LIKE @q
           ORDER BY id DESC`
        )
        .all({ q: `%${q}%` })
    : db.prepare('SELECT * FROM siswa ORDER BY id DESC').all();
  res.json(rows);
});

// READ: satu siswa
app.get('/api/siswa/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM siswa WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
  res.json(row);
});

// CREATE
app.post('/api/siswa', (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const info = db
      .prepare(
        `INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tanggal_siswa, jurusan_siswa)
         VALUES (@kode_siswa, @nama_siswa, @alamat_siswa, @tanggal_siswa, @jurusan_siswa)`
      )
      .run(data);
    const row = db.prepare('SELECT * FROM siswa WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch (err) {
    tanganiError(err, res);
  }
});

// UPDATE
app.put('/api/siswa/:id', (req, res) => {
  const { data, error } = validasi(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const info = db
      .prepare(
        `UPDATE siswa SET kode_siswa=@kode_siswa, nama_siswa=@nama_siswa, alamat_siswa=@alamat_siswa,
           tanggal_siswa=@tanggal_siswa, jurusan_siswa=@jurusan_siswa
         WHERE id=@id`
      )
      .run({ ...data, id: req.params.id });
    if (info.changes === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
    }
    res.json(db.prepare('SELECT * FROM siswa WHERE id = ?').get(req.params.id));
  } catch (err) {
    tanganiError(err, res);
  }
});

// DELETE
app.delete('/api/siswa/:id', (req, res) => {
  const info = db.prepare('DELETE FROM siswa WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API berjalan di http://localhost:${PORT}`);
});
