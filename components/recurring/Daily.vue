<template>
  <div class="space-y-4">
    <div class="repeatation__select-day">
      <BaseSelectDropdown
        orientation="vertical"
        :options="days"
        @change="onChange"
      />
    </div>
    <div class="repeatation__select-date-day">
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
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', date)
    },
    onChange (days) {
      this.$emit('change:form-days', days)
    }
  }
}
</script>

<style>
.repeatation__select-date-day  .jds-calendar {
  max-width: none !important;
}
.repeatation__select-date-day  .jds-calendar .jds-calendar__list-of-days,
.repeatation__select-date-day  .jds-calendar .jds-calendar__days {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  font-family: 'Roboto' !important;
}
</style>
