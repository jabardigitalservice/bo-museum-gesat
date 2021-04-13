<template>
  <button
    class="btn-style"
    :disabled="disabled"
    :class="disabled ? 'bg-gray4' : buttonStyle"
    @click="$emit('btn-click')"
  >
    {{ buttonLabel }}
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
    }
  },
  data () {
    return {
      buttonStyle: 'bg-primary',
      buttonLabel: 'default button'
    }
  },
  created () {
    switch (this.btnType) {
      case 'submit':
        this.buttonStyle = 'bg-primary'
        this.buttonLabel = 'Simpan'
        break

      case 'set':
        this.buttonStyle = 'bg-primary'
        this.buttonLabel = 'Terapkan'
        break

      case 'update':
        this.buttonStyle = 'bg-primary'
        this.buttonLabel = 'Perbarui'
        break

      case 'delete':
        this.buttonStyle = 'bg-red'
        this.buttonLabel = 'Hapus'
        break

      case 'clear':
        this.buttonStyle = 'bg-yellow'
        this.buttonLabel = 'Bersihkan'
        break

      default:
        this.buttonLabel = 'bg-yellow'
        this.buttonLabel = 'Tutup'
        break
    }
  }
}
</script>

<style>
.btn-style {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm text-white font-medium;
}

.btn-style:focus {
  @apply outline-none;
}
</style>
