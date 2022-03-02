<template>
  <div>
    <!-- Day -->
    <section class="mb-4 repeatation__select-month">
      <jds-select
        :value="days.value"
        :options="days"
        options-header="Hari"
        label="Hari"
        helper-text="* Wajib diisi"
        placeholder="Pilih"
        @change="onChangeDay"
      />
    </section>

    <!-- Week -->
    <section class="mb-4 repeatation__month">
      <jds-select
        :value="formWeek"
        name="approval_status"
        :options="weeks"
        options-header="Urutan"
        label="Minggu ke-"
        helper-text="* Wajib diisi"
        placeholder="Pilih"
        @change="onChangeWeek"
      />
    </section>

    <!-- Month Repetition -->
    <section class="mb-4">
      <label for="monthly-month" class="block text-sm">
        Pengulangan Tiap
        <span class="text-xs text-red-500">* Wajib diisi</span>
      </label>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <input
          id="monthly-month"
          type="number"
          min="1"
          max="3"
          :value="formMonth"
          class="w-full form-input bg-white rounded-lg border-gray-800 focus:outline-none hover:border-green-400 focus:border-green-400 cursor-pointer"
          @change="$emit('change:form-month', Number($event.target.value))"
        >
        <p class="block text-xs col-span-1">
          Bulan Sekali
          <span class="text-red-500">
            (Max 3)
          </span>
        </p>
      </div>
    </section>

    <!-- End Date -->
    <section class="repeatation__select-date-month">
      <jds-date-input
        :value="endDate"
        :disabled-dates="disabledDates"
        label="Tanggal Berakhir"
        @input="onSelected"
      />
    </section>
  </div>
</template>

<script>
import { days, weeks } from '@/assets/constant/enum'
import recurringMixins from './mixins/recurringMixins'

export default {
  mixins: [recurringMixins],
  props: {
    formWeek: {
      type: Number,
      default: null
    },
    formMonth: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      days,
      weeks,
      day: []
    }
  },
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', date)
    },
    onChangeDay (value) {
      if (value === 'Senin') {
        value = 1
      } else if (value === 'Selasa') {
        value = 2
      } else if (value === 'Rabu') {
        value = 3
      } else if (value === 'Kamis') {
        value = 4
      } else if (value === 'Jumat') {
        value = 5
      } else if (value === 'Sabtu') {
        value = 6
      } else if (value === 'Minggu') {
        value = 0
      } else {
        value = undefined
      }
      this.$emit('change:form-days', value)
    },
    onChangeWeek (value) {
      this.$emit('change:form-week', value)
    }
  }
}
</script>

<style lang="postcss" scoped>
.form {
  @apply w-full bg-white rounded-md;
}
</style>
