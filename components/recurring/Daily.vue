<template>
  <div class="space-y-4">
    <div>
      <label for="spaces" class="block text-sm">
        Hari
        <span class="text-red-800">*</span>
      </label>

      <!-- Multiple Select Dropdown -->
      <div>
        <div v-show="dropdownOpened" class="absolute inset-0 w-full h-full" @click="toggleDropdown" />
        <!-- Select Dropdown -->
        <div class="relative">
          <button class="w-full form-input bg-white rounded-md cursor-pointer" @click="toggleDropdown">
            <div class="flex justify-between text-left">
              <p>{{ selectedDays }}</p>
              <i class="bx bxs-chevron-down" aria-hidden="true" />
            </div>
          </button>

          <!-- Select Options -->
          <div
            v-show="dropdownOpened"
            class="absolute w-full z-10 flex flex-col shadow-lg border-2 border-gray3 p-2 overflow-auto bg-white h-56"
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
        <span class="text-red-800">*</span>
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
