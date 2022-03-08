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
        this.buttonColor = 'bg-green-700'
        this.buttonLabel = 'Edit'
        break
      case 'delete':
        this.buttonColor = 'bg-red-700'
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
  padding: 9px 16px;
  @apply w-full flex justify-between items-center text-left rounded-lg shadow-sm text-base leading-6 text-white font-normal;
}
.buttonClass:focus {
  @apply outline-none;
}
</style>
