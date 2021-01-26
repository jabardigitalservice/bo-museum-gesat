import moment from 'moment'
import VueJwtDecode from 'vue-jwt-decode'
require('moment-timezone')
const locale = 'id'
moment.locale(locale)

/* function to convert date use moment js */
// if input date in timezone
export function momentFormatDate (date) {
  if (moment(date).isValid()) {
    return moment(date).format('YYYY-MM-DD')
  }
  return ''
}
// indonesian standard format DD MMMM YYYY
export function momentFormatDateId (date) {
  if (moment(date).isValid()) {
    return moment(date).format('DD MMMM YYYY')
  }
  return ''
}

/* function to convert time in hour and minute use moment js */
// if input date in timezone
export function momentFormatTime (date) {
  if (moment(date).isValid()) {
    return moment.utc(date).format('HH:mm')
  }
  return ''
}

export function momentFormatTimeToTz (date) {
  if (moment(date).isValid()) {
    return moment.utc(date).tz('Asia/Jakarta').format('DD MMMM YYYY HH:mm')
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

export function generateTimes () {
  const hours = []
  for (let hour = 0; hour < 24; hour++) {
    hours.push(moment({ hour }).format('HH:mm'))
    hours.push(
      moment({
        hour,
        minute: 30
      }).format('HH:mm')
    )
  }
  return hours
}
