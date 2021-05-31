<template>
  <modal
    :name="modalName"
    :adaptive="true"
    height="auto"
    :scrollable="true"
    styles="overflow: visible"
    :click-to-close="!loading"
  >
    <div
      class="p-8 h-auto max-h-full flex flex-col"
      :class="overflow && 'overflow-y-auto'"
    >
      <!-- Modal Header -->
      <section class="flex flex-row justify-between align-middle mb-4">
        <h2 class="window-header uppercase">
          {{ modalTitle }}
        </h2>
        <button title="Tutup" @click="!loading && $modal.hide(modalName)">
          <i class="text-gray2 bx bx-x bx-sm cursor-pointer" aria-hidden="true" />
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
    },
    overflow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.vm--container .vm--modal {
  height: auto !important;
}
</style>
