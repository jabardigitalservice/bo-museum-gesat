import moment from 'moment'

// function to convert date use moment js
export function momentFormatDate (date) {
  return moment(date).locale('id').format('YYYY-MM-D')
}

// function to convert time in hour and minute use moment js
export function momentFormatTime (time) {
  return moment(time).format('HH:mm')
}
