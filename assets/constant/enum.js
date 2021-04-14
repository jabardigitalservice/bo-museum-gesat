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
    label: 'Resource / Aset'
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
    label: 'Tipe Resource'
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

export const menus = [
  {
    path: '/',
    label: 'Dashboard',
    iconClass: 'bx-home',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    path: '/reservasi',
    label: 'List / Histori Reservasi',
    iconClass: 'bx-calendar',
    role: [
      'employee_reservasi',
      'admin_reservasi'
    ]
  },
  {
    path: '/reservasi-command-center',
    label: 'Reservasi Command Center',
    iconClass: 'bx-calendar',
    role: [
      'admin_reservasi'
    ]
  },
  {
    path: '/resource',
    label: 'Resource/Aset',
    iconClass: 'bx-cabinet',
    role: [
      'admin_reservasi'
    ]
  },
  {
    path: '/command-center',
    label: 'Command Center',
    iconClass: 'bx-cabinet',
    role: [
      'admin_reservasi'
    ]
  },
  {
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

export const timeInterval = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
  '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
]
