# CRUD Data Siswa

Aplikasi sederhana pengelolaan data siswa.
Stack: **Node.js + Express + SQLite bawaan Node (`node:sqlite`, tanpa install tambahan)** untuk backend dan **React (Vite)** untuk frontend.

## Struktur
```
siswa-crud/
├── backend/    # REST API + database SQLite (siswa.db dibuat otomatis)
└── frontend/   # Antarmuka React
```

## Cara menjalankan
Butuh **Node.js 22.5 atau lebih baru** (cek dengan `node -v`). Buka dua terminal.

**Terminal 1 – backend (port 5000)**
```bash
cd backend
npm install
npm start
```

**Terminal 2 – frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```
Buka http://localhost:5173

## Endpoint API
| Method | URL               | Fungsi                              |
|--------|-------------------|-------------------------------------|
| GET    | /api/siswa?q=kata | Daftar siswa (opsional pencarian)   |
| GET    | /api/siswa/:id    | Detail satu siswa                   |
| POST   | /api/siswa        | Tambah siswa                        |
| PUT    | /api/siswa/:id    | Ubah siswa                          |
| DELETE | /api/siswa/:id    | Hapus siswa                         |

Field: `kode_siswa` (unik), `nama_siswa`, `alamat_siswa`, `tanggal_siswa`, `jurusan_siswa`.
Tema UI: Hijau muda (soft green) minimalis dan modern.
