import { days } from '../../../assets/constant/enum'
import { momentFormatDate } from '../../../utils/index'

const recurringMixins = {
  props: {
    formDays: {
      type: Array,
      default: () => ([])
    },
    formStartDate: {
      type: String,
      default: null
    },
    formEndDate: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      days
    }
  },
  computed: {
    disabledDates () {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      const startDate = new Date(this.formStartDate)
      const oneYearAhead = yesterday.setFullYear(new Date().getFullYear() + 1)
      const tenYearsAhead = yesterday.setFullYear(new Date().getFullYear() + 10)
      return {
        to: startDate,
        ranges: [{
          from: oneYearAhead,
          to: tenYearsAhead
        }]
      }
    },
    selectedDays () {
      const days = this.formDays
        .map(formDay => this.days.find(day => day.index === formDay))
        .sort((a, b) => a.index === 0 ? 1 : b.index === 0 ? -1 : a.index - b.index)
        .map(formday => formday.name)
      return days.join(', ')
    },
    endDate () {
      const dateSplit = this.formEndDate.split('/').reverse().join(', ')
      const endDate = new Date(dateSplit)
      const newEndDate = momentFormatDate(endDate, 'DD/MM/YYYY')
      return newEndDate
    }
  }
}

export default recurringMixins
