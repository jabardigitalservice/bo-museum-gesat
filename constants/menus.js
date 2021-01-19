const menus = [
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
    path: '/resource',
    label: 'Resource/Aset',
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
export default menus
