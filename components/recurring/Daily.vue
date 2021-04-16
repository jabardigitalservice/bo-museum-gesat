<template>
  <div class="space-y-4">
    <div>
      <label for="spaces" class="block text-sm">
        Hari
        <span class="text-red">*</span>
      </label>

      <!-- Multiple Select Dropdown -->
      <div>
        <div v-show="dropdownOpened" class="absolute inset-0 w-full h-full" @click="toggleDropdown" />
        <!-- Select Dropdown -->
        <div class="relative">
          <button class="w-full form-input bg-white rounded-md cursor-pointer" @click="toggleDropdown">
            <div class="flex justify-between ">
              <p>
                <span v-for="(selectedDay, index) in selectedDays" :key="index">{{ selectedDay }}</span>
              </p>
              <i class="bx bxs-chevron-down" />
            </div>
          </button>

          <!-- Select Options -->
          <div
            v-show="dropdownOpened"
            class="flex flex-col shadow-lg border-2 border-gray3 p-2 overflow-auto bg-white h-56"
          >
            <label v-for="day in days" :key="day.index" class="cursor-pointer p-1 hover:bg-blue">
              <input v-model="form.days" :value="day.index" type="checkbox">
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
        v-model="form.end_date"
        class="form-input rounded-md"
        required
      />
    </div>
  </div>
</template>

<script>
import { days } from '../../assets/constant/enum'

export default {
  data () {
    return {
      dropdownOpened: false,
      form: {
        days: [],
        end_date: null
      },
      days
    }
  },
  computed: {
    selectedDays () {
      const selectedDays = []
      this.form.days.forEach((day) => {
        selectedDays.push(...this.days.filter(d => d.index === day))
      })
      selectedDays.sort((a, b) => a.index - b.index)
      return [...selectedDays.map(selectedDay => selectedDay.name)].join(', ')
    }
  },
  methods: {
    toggleDropdown () {
      this.dropdownOpened = !this.dropdownOpened
    }
  }
}
</script>
