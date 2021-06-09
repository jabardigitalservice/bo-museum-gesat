<template>
  <div class="w-full flex flex-row lg:flex-row-reverse items-center mt-3">
    <div class="w-full flex flex-row justify-end items-center">
      <button class="pagination__btn" @click="prevPagination">
        <i class="bx bx-left-arrow-alt bx-sm" aria-hidden="true" />
      </button>
      <button
        v-for="x in lengthPage"
        :key="x"
        :class="{
          'pagination--active': mActivePagination === x + stepNumber,
          pagination: mActivePagination !== x + stepNumber,
        }"
        @click="clickPagination(x)"
      >
        {{ x + stepNumber }}
      </button>
      <button class="pagination__btn" @click="nextPagination">
        <i class="bx bx-right-arrow-alt bx-sm" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activePagination: {
      type: Number,
      default: 1
    },
    lengthData: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      mActivePagination: this.activePagination,
      stepNumber: 0,
      showNumber: {
        start: 1,
        end: 5
      }
    }
  },
  computed: {
    lengthPage () {
      if (this.lengthData < 5) {
        return this.lengthData
      } else {
        return 5
      }
    }
  },
  watch: {
    activePagination (val) {
      this.mActivePagination = val
    }
  },
  methods: {
    clickPagination (numberOfPagination) {
      this.mActivePagination = numberOfPagination + this.stepNumber
      this.$emit('update', this.mActivePagination)
    },
    prevPagination () {
      if (this.mActivePagination > 1) {
        this.mActivePagination--
        this.$emit('update', this.mActivePagination)
        if (this.mActivePagination < this.showNumber.start) {
          this.showNumber.start--
          this.showNumber.end--
          this.stepNumber--
        }
      }
    },
    nextPagination () {
      if (this.mActivePagination < this.$props.lengthData) {
        this.mActivePagination++
        this.$emit('update', this.mActivePagination)
        if (this.mActivePagination > this.showNumber.end) {
          this.showNumber.start++
          this.showNumber.end++
          this.stepNumber++
        }
      }
    }
  }
}
</script>
