export const statusReservation = [{
  key: 'NOT_YET_APPROVED',
  value: 'Sedang diproses'
}, {
  key: 'ALREADY_APPROVED',
  value: 'Diterima'
}, {
  key: 'REJECTED',
  value: 'Ditolak'
}]

export const optionsSortBy = [{
  key: 'title',
  value: 'Judul Kegiatan'
}, {
  key: 'created_at',
  value: 'Tanggal Reservasi Dibuat'
}, {
  key: 'reservation_time',
  value: 'Tanggal dan Waktu Kegiatan'
}]

export const optionsOrderBy = [{
  key: 'asc',
  value: 'Ascending'
}, {
  key: 'desc',
  value: 'Descending'
}]

export const optionsOrderByIdn = [{
  key: 'asc',
  value: 'A-Z / Terlama'
}, {
  key: 'desc',
  value: 'Z-A / Terbaru'
}]

export const optionsStatusResource = [
  {
    value: 'active',
    label: 'Aktif'
  },
  {
    value: 'not_active',
    label: 'Tidak Aktif'
  }

]

export const optionsResourceType = ['offline', 'online']

export const optionsSortResource = [
  {
    value: 'name',
    label: 'Nama'
  },
  {
    value: 'created_at',
    label: 'Tanggal dibuat'
  },
  {
    value: 'status',
    label: 'Status'
  },
  {
    value: 'capacity',
    label: 'Kapasitas'
  },
  {
    value: 'resource_type',
    label: 'Tipe'
  }
]
export const cardsDashboard = [
  {
    title: 'Reservasi Dibuat',
    value: 0,
    bgColor: 'bg-blue',
    icon: 'bx-calendar'
  }
]

export const parentMenus = [
  {
    id: 1,
    path: '#',
    label: 'Reservasi Aset',
    iconClass: 'bx-home',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    id: 2,
    path: '#',
    label: 'Reservasi Command Center',
    iconClass: 'bx-home',
    role: [
      'admin_reservasi'
    ]
  }
]

export const menus = [
  {
    parent: 1,
    path: '/',
    label: 'Kalender Reservasi',
    iconClass: 'bx-calendar',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/reservasi',
    label: 'List Reservasi',
    iconClass: 'bx-calendar',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/reservasi-command-center',
    label: 'List Reservasi',
    iconClass: 'bx-calendar',
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/resource',
    label: 'Ruangan/Aset',
    iconClass: 'bx-cabinet',
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/command-center',
    label: 'Pengaturan Command Center',
    iconClass: 'bx-cabinet',
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 0,
    path: '/logout',
    label: 'Logout',
    iconClass: 'bx-log-out',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  }
]

export const thResourceAsset = [
  'Nama',
  'Deskripsi',
  'Kapasitas',
  'Tipe',
  'Status',
  'Tanggal dibuat',
  'Aksi'
]

export const days = [
  {
    index: 1,
    name: 'Senin'
  },
  {
    index: 2,
    name: 'Selasa'
  },
  {
    index: 3,
    name: 'Rabu'
  },
  {
    index: 4,
    name: 'Kamis'
  },
  {
    index: 5,
    name: 'Jumat'
  },
  {
    index: 6,
    name: 'Sabtu'
  },
  {
    index: 0,
    name: 'Minggu'
  }
]

export const repeatType = [
  {
    value: 'NONE',
    name: 'Tidak'
  },
  {
    value: 'DAILY',
    name: 'Perhari'
  },
  {
    value: 'WEEKLY',
    name: 'Perminggu'
  },
  {
    value: 'MONTHLY',
    name: 'Perbulan'
  }
]
