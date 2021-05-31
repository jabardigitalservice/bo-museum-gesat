<template>
  <div class="w-full relative">
    <button v-on-clickaway="closeDropdown" type="button" class="buttonClass" :class="buttonColor" @click="toggleDropdown">
      {{ buttonLabel }}
      <i class="text-white bx bx-chevron-down bx-sm cursor-pointer" aria-hidden="true" />
    </button>
    <div v-if="dropdownOpened" class="absolute flex flex-col py-4 px-4 gap-4 rounded-md w-full" :class="buttonColor" style="top: 70px;">
      <div class="w-full flex flex-col gap-4 text-sm items-start text-left text-white font-medium">
        <slot name="options" />
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickOutside } from 'vue-clickaway'

export default {
  mixins: [clickOutside],
  props: {
    buttonType: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      buttonColor: '',
      buttonLabel: '',
      dropdownOpened: false
    }
  },
  created () {
    switch (this.buttonType) {
      case 'edit':
        this.buttonColor = 'bg-yellow'
        this.buttonLabel = 'Edit'
        break
      case 'delete':
        this.buttonColor = 'bg-red'
        this.buttonLabel = 'Hapus'
    }
  },
  methods: {
    toggleDropdown () {
      this.dropdownOpened = !this.dropdownOpened
    },
    closeDropdown () {
      this.dropdownOpened = false
    }
  }
}
</script>

<style lang="postcss">
.buttonClass {
  @apply w-full flex justify-between items-center text-left py-2 px-4 mt-6 rounded-md shadow-sm text-sm text-white font-medium
}
.buttonClass:focus {
  @apply outline-none
}
</style>
