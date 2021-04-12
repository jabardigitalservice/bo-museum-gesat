<template>
  <modal :name="modalName" height="auto" width="50%" scrollable="true">
    <div class="p-8 h-full flex flex-col justify-between">
      <!-- Modal Header -->
      <section class="flex flex-row justify-between align-middle mb-4">
        <h2 class="window-header uppercase">
          {{ modalTitle }}
        </h2>
        <button title="Tutup" @click="$modal.hide(modalName)">
          <i class="text-gray2 bx bx-x bx-sm cursor-pointer" />
        </button>
      </section>

      <!-- Modal Body -->
      <section class="flex-1 mb-8">
        <slot name="body" />
      </section>

      <!-- Modal Footer/Buttons -->
      <section class="flex gap-2 justify-between">
        <slot name="buttons" />
      </section>
    </div>
  </modal>
</template>

<script>
export default {
  props: {
    modalTitle: {
      type: String,
      default: 'default modal'
    },
    modalName: {
      type: String,
      default: 'defaultModal'
    }
  }
}
</script>

<style>
</style>
