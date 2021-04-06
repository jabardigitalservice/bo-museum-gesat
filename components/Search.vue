<template>
  <modal
    name="search"
    height="50%"
    :adaptive="true"
  >
    <div class="p-8 space-y-4">
      <div class="window-header mb-2">
        SEARCH DATA RESERVASI
      </div>
      <div>
        <label class="block text-sm">
          Criteria
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
          Keyword
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
      <div class="flex space-x-4">
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="$emit('clear-search')"
        >
          Clear
        </button>
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          :disabled="!by || !keyword"
          :class="!by || !keyword ? 'cursor-not-allowed bg-gray4' : ''"
          @click="$emit('on-search')"
        >
          Submit
        </button>
      </div>
    </div>
  </modal>
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
