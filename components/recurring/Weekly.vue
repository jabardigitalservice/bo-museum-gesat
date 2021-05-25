<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm">
        Pengulangan Tiap
        <span class="text-red">*</span>
      </label>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <input
          type="number"
          class="w-full form-input bg-white rounded-md cursor-pointer"
          :value="formWeek"
          @input="$emit('input:form-week', $event.target.value)"
        >
        <p class="block text-sm col-span-1">
          Minggu Sekali
          <span class="text-red">
            (Max 12)
          </span>
        </p>
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
              <input :value="day.index" type="checkbox" :checked="checkedDays(day.index)" @change="$emit('change:form-days', Number($event.target.value))">
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
import recurringMixins from './mixins/recurringMixins'

export default {
  mixins: [recurringMixins],
  props: {
    formWeek: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      dropdownOpened: false
    }
  },
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', new Date(date).toISOString())
    },
    toggleDropdown () {
      this.dropdownOpened = !this.dropdownOpened
    },
    checkedDays (id) {
      return this.formDays.includes(id)
    }
  }
}
</script>
