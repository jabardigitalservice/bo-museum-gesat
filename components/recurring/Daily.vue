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
