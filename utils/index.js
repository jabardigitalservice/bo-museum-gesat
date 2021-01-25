import moment from 'moment'
import VueJwtDecode from 'vue-jwt-decode'

/* function to convert date use moment js */
// if input date in timezone
export function momentFormatDate (date) {
  if (moment(date).isValid()) {
    return moment(date).locale('id').format('YYYY-MM-DD')
  }
  return ''
}
// indonesian standard format DD MMMM YYYY
export function momentFormatDateId (date) {
  if (moment(date).isValid()) {
    return moment(date).locale('id').format('DD MMMM YYYY')
  }
  return ''
}

/* function to convert time in hour and minute use moment js */
// if input date in timezone
export function momentFormatTime (date) {
  if (moment(date).isValid()) {
    return moment.utc(date).locale('id').format('HH:mm')
  }
  return ''
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
