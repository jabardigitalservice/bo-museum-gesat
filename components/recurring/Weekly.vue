<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm">
        Berapa Minggu Sekali
        <span class="text-red">*</span>
      </label>

      <!-- Input Weekly Number -->
      <div>
        <input
          type="number"
          class="w-full form-input bg-white rounded-md cursor-pointer"
          @input="$emit('input:form-week', $event.target.value)"
        >
      </div>
    </div>
    <div>
      <label class="block text-sm">
        Hari
        <span class="text-red">*</span>
      </label>

      <!-- Multiple Select Dropdown -->
      <div>
        <div v-show="dropdownOpened" class="absolute inset-0 w-full h-full" @click="toggleDropdown" />
        <!-- Select Dropdown -->
        <div class="relative">
          <button class="w-full form-input bg-white rounded-md cursor-pointer" @click="toggleDropdown">
            <div class="flex justify-between text-left">
              <p>
                <span v-for="(selectedDay, index) in selectedDays" :key="index">{{ selectedDay }}</span>
              </p>
              <i class="bx bxs-chevron-down" />
            </div>
          </button>

          <!-- Select Options -->
          <div
            v-show="dropdownOpened"
            class="absolute flex flex-col shadow-lg border-2 border-gray3 p-2 overflow-auto bg-white h-56 w-full z-50"
          >
            <label v-for="day in days" :key="day.index" class="cursor-pointer p-1 hover:bg-blue">
              <input :value="day.index" type="checkbox" @change="$emit('change:form-days', Number($event.target.value))">
              {{ day.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label class="block text-sm">
        Tanggal Berakhir
        <span class="text-red">*</span>
      </label>
      <date-picker
        :value="endDate"
        class="form-input rounded-md"
        required
        :disabled-dates="disabledDates"
        @selected="onSelected"
      />
    </div>
  </div>
</template>

<script>
import { days } from '../../assets/constant/enum'
export default {
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
      dropdownOpened: false,
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
      return endDate < startDate.toISOString() ? startDate : endDate
    }
  },
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', new Date(date).toISOString())
    },
    toggleDropdown () {
      this.dropdownOpened = !this.dropdownOpened
    }
  }
}
</script>
