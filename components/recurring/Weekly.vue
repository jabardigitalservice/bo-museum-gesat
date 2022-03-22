<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm">
        Pengulangan Tiap
        <span class="text-xs text-red">* Wajib diisi</span>
      </label>
      <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <input
          type="number"
          class="w-full form-input bg-white rounded-lg border-gray-800 focus:outline-none hover:border-green-400 focus:border-green-400 cursor-pointer"
          :value="formWeek"
          @input="$emit('input:form-week', $event.target.value)"
        >
        <p class="block text-xs col-span-1">
          Minggu Sekali
          <span class="text-xs text-red">
            (Max 12)
          </span>
        </p>
      </div>
    </div>
    <div>
      <div class="repeatation__select-week">
        <BaseSelectDropdown
          orientation="vertical"
          :options="days"
          @change="onChange"
        />
      </div>
    </div>
    <div class="repeatation__select-date-week">
      <jds-date-input
        :value="endDate"
        :disabled-dates="disabledDates"
        label="Tanggal Berakhir"
        @input="onSelected"
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
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', date)
    },
    onChange (value) {
      this.$emit('change:form-days', value)
    }
  }
}
</script>

<style>
.repeatation__select-date-week  .jds-calendar {
  max-width: none !important;
}
.repeatation__select-date-week  .jds-calendar .jds-calendar__list-of-days,
.repeatation__select-date-week  .jds-calendar .jds-calendar__days {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  font-family: 'Roboto' !important;
}
</style>
