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

export function momentFormatTime2 (date) {
  if (moment(date).isValid()) {
    return moment(date).format('HH:mm')
  }
  return ''
}

export function momentFormatTimeToTz (date) {
  if (moment(date).isValid()) {
    return moment.utc(date).tz('Asia/Jakarta').format('DD MMMM YYYY HH:mm')
  }
  return ''
}

export function momentGetCurrentDate () {
  return moment().format('YYYY-MM-DD')
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
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    times.push(moment({ hour }).format('HH:mm'))
    times.push(
      moment({
        hour,
        minute: 30
      }).format('HH:mm')
    )
  }
  return times
}

export function filterTimeAfterCurrent (times) {
  const currentTime = moment().format('HH:mm')
  const filteredTimes = []
  for (let i = 0; i < times.length; i++) {
    if (times[i] > currentTime) {
      filteredTimes.push(times[i])
    }
  }
  return filteredTimes
}
