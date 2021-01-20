import VueJwtDecode from 'vue-jwt-decode'
export default function ({ $auth, redirect }) {
  // If the user is not authenticated
  const tokenBearer = $auth.strategy.token.get()
  const token = tokenBearer.split(' ')
  const tokendecode = VueJwtDecode.decode(token[1])
  if (!tokendecode.realm_access.roles.includes('admin_reservasi')) {
    return redirect('/404')
  }
}
