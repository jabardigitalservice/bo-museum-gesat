const icon = {
  home: 'bx-home',
  calendar: 'bx-calendar',
  cabinet: 'bx-cabinet',
  logOut: 'bx-log-out'
}

export const statusReservation = [{
  value: 'NOT_YET_APPROVED',
  label: 'Sedang diproses'
}, {
  value: 'ALREADY_APPROVED',
  label: 'Diterima'
}, {
  value: 'REJECTED',
  label: 'Ditolak'
}]

export const optionsSortBy = [{
  value: 'title',
  label: 'Judul Kegiatan'
}, {
  value: 'created_at',
  label: 'Tanggal Reservasi Dibuat'
}, {
  value: 'reservation_time',
  label: 'Tanggal Kegiatan'
}]

export const optionsOrderBy = [{
  key: 'asc',
  value: 'Ascending'
}, {
  key: 'desc',
  value: 'Descending'
}]

export const optionsOrderByIdn = [{
  value: 'asc',
  label: 'A-Z / Terlama'
}, {
  value: 'desc',
  label: 'Z-A / Terbaru'
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

export const optionsResourceType = [
  {
    value: 'online',
    label: 'Online'
  },
  {
    value: 'offline',
    label: 'Offline'
  }
]

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
    icon: icon.calendar
  }
]

export const parentMenus = [
  {
    id: 1,
    path: '#',
    label: 'Reservasi Aset',
    iconClass: icon.home,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    id: 2,
    path: '#',
    label: 'Reservasi Command Center',
    iconClass: icon.home,
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
    iconClass: icon.calendar,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/reservasi',
    label: 'List Reservasi',
    iconClass: icon.calendar,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/reservasi-command-center',
    label: 'List Reservasi',
    iconClass: icon.calendar,
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/resource',
    label: 'Ruangan/Aset',
    iconClass: icon.cabinet,
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/command-center',
    label: 'Pengaturan Command Center',
    iconClass: icon.cabinet,
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 0,
    path: '/logout',
    label: 'Logout',
    iconClass: icon.logOut,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  }
]

export const thResourceAsset = [
  {
    key: 'name',
    text: 'Nama'
  },
  {
    key: 'description',
    text: 'Deskripsi'
  },
  {
    key: 'capacity',
    text: 'Kapasitas'
  },
  {
    key: 'resource_type',
    text: 'Tipe'
  },
  {
    key: 'status',
    text: 'Status'
  },
  {
    key: 'created_at',
    text: 'Tanggal dibuat'
  },
  {
    key: 'action',
    text: 'Aksi'
  }
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

export const repeatType = {
  NONE: 'Tidak',
  DAILY: 'Perhari',
  WEEKLY: 'Perminggu',
  MONTHLY: 'Perbulan'
}
