export const rangeTimes = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00'
]

export const statusReservation = [{
  key: 'not_yet_approved',
  value: 'Waiting'
}, {
  key: 'already_approved',
  value: 'Approved'
}, {
  key: 'rejected',
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
}, {
  key: 'approval_status',
  value: 'Status'
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
  }
]
export const cardsDashboard = [
  {
    title: 'Reservasi Dibuat',
    value: 0,
    bgColor: 'bg-blue',
    icon: 'bx-calendar'
  },
  {
    title: 'Reservasi Disetujui',
    value: 0,
    bgColor: 'bg-primary',
    icon: 'bx-calendar-check'
  },
  {
    title: 'Reservasi Ditolak',
    value: 0,
    bgColor: 'bg-red',
    icon: 'bx-calendar-x'
  }
]
