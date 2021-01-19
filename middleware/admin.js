export default function ({ $auth, redirect }) {
  // If the user is not authenticated
  if ($auth.$storage.getState('role') !== 'admin_reservasi') {
    return redirect('/404')
  }
}
