// SQLite bawaan Node.js (butuh Node 22.5+), tidak perlu install paket tambahan.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'siswa.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS siswa (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    kode_siswa     TEXT NOT NULL UNIQUE,
    nama_siswa     TEXT NOT NULL,
    alamat_siswa   TEXT,
    tanggal_siswa  TEXT,
    jurusan_siswa  TEXT NOT NULL,
    created_at     TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

module.exports = db;
