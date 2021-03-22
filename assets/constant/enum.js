export const statusReservation = [{
  key: 'NOT_YET_APPROVED',
  value: 'Waiting'
}, {
  key: 'ALREADY_APPROVED',
  value: 'Approved'
}, {
  key: 'REJECTED',
  value: 'Rejected'
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
    label: 'Reservasi',
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
