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
  // {
  //   id: 1,
  //   path: '#',
  //   label: 'Reservasi Aset',
  //   iconClass: icon.home,
  //   role: [
  //     'employee_reservasi',
  //     'admin_reservasi'
  //   ]
  // },
  {
    id: 1,
    path: '#',
    label: 'Reservasi Gedung Sate',
    iconClass: icon.home,
    role: [
      'admin_reservasi'
    ]
  }
]

export const menus = [
  {
    parent: 2,
    path: '/',
    label: 'Kalender Reservasi',
    iconClass: icon.calendar,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/reservasi',
    label: 'List Reservasi',
    iconClass: icon.calendar,
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/reservasi-gedung-sate',
    label: 'List Reservasi',
    iconClass: icon.calendar,
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 2,
    path: '/resource',
    label: 'Ruangan/Aset',
    iconClass: icon.cabinet,
    role: [
      'admin_reservasi'
    ]
  },
  {
    parent: 1,
    path: '/gedung-sate',
    label: 'Pengaturan Gedung Sate',
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
    value: 'Senin',
    text: 'Senin',
    label: 'Senin'
  },
  {
    index: 2,
    value: 'Selasa',
    text: 'Selasa',
    label: 'Selasa'
  },
  {
    index: 3,
    value: 'Rabu',
    text: 'Rabu',
    label: 'Rabu'
  },
  {
    index: 4,
    value: 'Kamis',
    text: 'Kamis',
    label: 'Kamis'
  },
  {
    index: 5,
    value: 'Jumat',
    text: 'Jumat',
    label: 'Jumat'
  },
  {
    index: 6,
    value: 'Sabtu',
    text: 'Sabtu',
    label: 'Sabtu'

  },
  {
    index: 0,
    value: 'Minggu',
    text: 'Minggu',
    label: 'Minggu'
  }
]

export const repeatType = [
  {
    value: 'NONE',
    label: 'Tidak'
  },
  {
    value: 'DAILY',
    label: 'Perhari'
  },
  {
    value: 'WEEKLY',
    label: 'Perminggu'
  },
  {
    value: 'MONTHLY',
    label: 'Perbulan'
  }
]

export const weeks = [
  {
    value: 1,
    label: 'Satu'
  },
  {
    value: 2,
    label: 'Dua'
  },
  {
    value: 3,
    label: 'Tiga'
  },
  {
    value: 4,
    label: 'Empat'
  }
]
