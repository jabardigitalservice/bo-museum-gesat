<template>
  <div>
    <!-- Day -->
    <section class="mb-4">
      <label for="monthly-day" class="block text-sm">
        Hari
        <span class="text-red">*</span>
      </label>
      <select
        id="monthly-day"
        class="form form-input"
        :value="formDays"
        @change="$emit('change:form-days', Number($event.target.value))"
      >
        <option v-for="day in days" :key="day.index" :value="day.index">
          {{ day.name }}
        </option>
      </select>
    </section>

    <!-- Week -->
    <section class="mb-4">
      <label for="monthly-week" class="block text-sm">
        Minggu Ke-
        <span class="text-red">*</span>
      </label>
      <select
        id="monthly-week"
        class="form form-input"
        :value="formWeek"
        @change="$emit('change:form-week', Number($event.target.value))"
      >
        <option value="1">
          Satu
        </option>
        <option value="2">
          Dua
        </option>
        <option value="3">
          Tiga
        </option>
        <option value="4">
          Empat
        </option>
      </select>
    </section>

    <!-- Month Repetition -->
    <section class="mb-4">
      <label for="monthly-month" class="block text-sm">
        Pengulangan Tiap
        <span class="text-red">*</span>
      </label>
      <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <input
          id="monthly-month"
          type="number"
          min="1"
          max="3"
          :value="formMonth"
          class="form form-input md:col-span-2 sm:col-span-1"
          @change="$emit('change:form-month', Number($event.target.value))"
        >
        <p class="block text-sm col-span-1 text-">
          Bulan Sekali
          <span class="text-red">
            (Max 3)
          </span>
        </p>
      </div>
    </section>

    <!-- End Date -->
    <section>
      <label class="block text-sm">
        Tanggal Berakhir
        <span class="text-red">*</span>
      </label>
      <date-picker
        :value="endDate"
        class="form form-input"
        required
        :disabled-dates="disabledDates"
        @selected="onSelected"
      />
    </section>
  </div>
</template>

<script>
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
  methods: {
    onSelected (date) {
      this.$emit('selected:form-end-date', new Date(date).toISOString())
    }
  }
}
</script>

<style scoped>
.form {
  @apply w-full bg-white rounded-md;
}
</style>
