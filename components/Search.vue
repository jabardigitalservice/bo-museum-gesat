<template>
  <BaseModal
    modal-name="search"
    modal-title="Cari Data Reservasi"
  >
    <template #body>
      <div class="mb-4">
        <label class="block text-sm">
          Kriteria
          <div class="mt-1">
            <select
              :value="by"
              class="form-input bg-white rounded-md"
              @change="$emit('input-by', $event.target.value)"
            >
              <option value="reservation_code">
                Kode Reservasi
              </option>
              <option value="name">
                Nama PIC
              </option>
              <option value="organization_name">
                Nama Instansi
              </option>
            </select>
          </div>
        </label>
      </div>
      <div>
        <label class="block text-sm">
          Kata Kunci
          <div class="flex mt-1">
            <input
              :value="keyword"
              class="w-full focus:outline-none border border-gray5 p-2 rounded-md"
              type="text"
              @input="$emit('input-keyword', $event.target.value)"
            >
          </div>
        </label>
      </div>
    </template>
    <template #buttons>
      <ModalButton
        btn-type="clear"
        @btn-click="$emit('clear-search')"
      />
      <ModalButton
        btn-type="set"
        :disabled="!by || !keyword"
        :class="!by || !keyword ? 'cursor-not-allowed bg-gray4' : ''"
        @btn-click="$emit('on-search')"
      />
    </template>
  </BaseModal>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: null
    },
    by: {
      type: String,
      default: null
    }
  }
}
</script>
