export const rangeTimes = [
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
  '18:00'
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
    id: 0,
    value: 'active',
    label: 'Aktif'
  },
  {
    id: 1,
    value: 'not_active',
    label: 'Tidak Aktif'
  }

]

export const optionsSortResource = [
  {
    id: 0,
    value: 'name',
    label: 'Resource / Aset'
  },
  {
    id: 1,
    value: 'created_at',
    label: 'Tanggal dibuat'
  },
  {
    id: 2,
    value: 'status',
    label: 'Status'
  }

]
