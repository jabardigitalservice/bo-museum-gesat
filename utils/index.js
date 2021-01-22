import moment from 'moment'

/* function to convert date use moment js */
// if input date in timezone
export function momentFormatDate (date) {
  return moment(date).locale('id').format('YYYY-MM-DD')
}
// indonesian standard format DD MMMM YYYY
export function momentFormatDateId (date) {
  return moment(date).locale('id').format('DD MMMM YYYY')
}

/* function to convert time in hour and minute use moment js */
// if input date in timezone
export function momentFormatTime (date) {
  return moment(date).format('HH:mm')
}
// if input is time in hh:mm:ss, remove seconds
export function momentTimeHHmm (time) {
  return moment(time, 'HH:mm:ss').format('HH:mm')
}
