export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (store.state.role.role !== 'admin_reservasi') {
    return redirect('/404')
  }
}
