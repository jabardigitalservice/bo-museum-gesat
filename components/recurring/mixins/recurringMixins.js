import { days } from '../../../assets/constant/enum'

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
      const startDate = this.disabledDates.to
      const endDate = this.formEndDate
      return startDate && endDate
    }
  }
}

export default recurringMixins
