<template>
  <button
    class="btn-style"
    :disabled="disabled || loading"
    :class="disabled ? 'bg-gray4' : buttonStyle"
    @click="$emit('btn-click')"
  >
    <slot name="label">
      <div v-if="loading">
        <div class="spinner" />
      </div>
      <div v-else>
        {{ buttonLabel }}
      </div>
    </slot>
  </button>
</template>

<script>
export default {
  props: {
    btnType: {
      type: String,
      default: 'close'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      background: {
        primary: 'bg-primary',
        red: 'bg-red',
        yellow: 'bg-yellow'
      },
      buttonStyle: 'bg-primary',
      buttonLabel: 'default button'
    }
  },
  created () {
    switch (this.btnType) {
      case 'submit':
        this.buttonStyle = this.background.primary
        this.buttonLabel = 'Simpan'
        break
      case 'set':
        this.buttonStyle = this.background.primary
        this.buttonLabel = 'Terapkan'
        break
      case 'update':
        this.buttonStyle = this.background.primary
        this.buttonLabel = 'Perbarui'
        break
      case 'delete':
        this.buttonStyle = this.background.red
        this.buttonLabel = 'Hapus'
        break
      case 'edit':
        this.buttonStyle = this.background.yellow
        this.buttonLabel = 'Edit'
        break
      case 'clear':
        this.buttonStyle = this.background.yellow
        this.buttonLabel = 'Bersihkan'
        break
      default:
        this.buttonStyle = this.background.yellow
        this.buttonLabel = 'Tutup'
        break
    }
  }
}
</script>

<style scoped>
.btn-style {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm text-white font-medium;
}
.btn-style:focus {
  @apply outline-none;
}
.spinner {
  @apply w-5 h-5 rounded-full border-2 border-transparent animate-spin;
  border-top-color: white;
  border-right-color: white;
}
</style>
