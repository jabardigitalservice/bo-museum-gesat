import moment from 'moment'
import VueJwtDecode from 'vue-jwt-decode'

// function to convert date use moment js
export function momentFormatDate (date) {
  return moment(date).locale('id').format('YYYY-MM-DD')
}

// function to convert time in hour and minute use moment js
export function momentFormatTime (time) {
  return moment(time).format('HH:mm')
}

export function isAdmin ($auth) {
  const tokenBearer = $auth.strategy.token.get()
  const token = tokenBearer.split(' ')
  const tokenDecode = VueJwtDecode.decode(token[1])
  if (tokenDecode.realm_access.roles.includes('admin_reservasi')) {
    return true
  }
  return false
}
