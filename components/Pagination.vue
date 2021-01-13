<template>
  <div class="w-full flex flex-row lg:flex-row-reverse items-center mt-3">
    <div class="w-full flex flex-row justify-end items-center">
      <button class="btn-pagination" @click="prevPagination">
        <i class="bx bx-left-arrow-alt bx-sm" />
      </button>
      <button
        v-for="x in 5"
        :key="x"
        :class="{
          'pagination-active': activePag === x + stepNumber,
          pagination: activePag !== x + stepNumber,
        }"
        @click="activePag = x + stepNumber"
      >
        {{ x + stepNumber }}
      </button>
      <button class="btn-pagination" @click="nextPagination">
        <i class="bx bx-right-arrow-alt bx-sm" />
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
      default: 10
    }
  },
  data () {
    return {
      activePag: this.$props.activePagination,
      stepNumber: 0,
      showNumber: {
        start: 1,
        end: 5
      }
    }
  },
  methods: {
    prevPagination () {
      if (this.activePag > 1) {
        this.activePag--
        this.$emit('update', this.activePag)
        if (this.activePag < this.showNumber.start) {
          this.showNumber.start--
          this.showNumber.end--
          this.stepNumber--
        }
      }
    },
    nextPagination () {
      if (this.activePag < this.$props.lengthData) {
        this.activePag++
        this.$emit('update', this.activePag)
        if (this.activePag > this.showNumber.end) {
          this.showNumber.start++
          this.showNumber.end++
          this.stepNumber++
        }
      }
    }
  }
}
</script>
