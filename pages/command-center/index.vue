<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Command Center
      </h1>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-2/3 lg:w-1/2">
            <button class="btn bg-primary">
              <i class="bx bx-plus bx-sm" />
              <span>Tambah Tanggal Tutup</span>
            </button>
          </div>
        </div>
        <div
          class="w-full lg:w-1/2 flex flex-wrap-reverse lg:flex-wrap flex-row-reverse"
        >
          <div class="w-1/2 lg:w-1/4 my-1 pl-1">
            <button class="btn bg-yellow">
              <i class="bx bx-sort-up bx-sm" />
              <span>Urutkan</span>
            </button>
          </div>
          <div class="w-1/2 lg:w-1/4 my-1 lg:pl-1">
            <button class="btn bg-blue">
              <i class="bx bx-filter bx-sm" />
              <span>Filter</span>
            </button>
          </div>
          <div class="w-full lg:w-1/2 my-1">
            <div
              class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center"
            >
              <input
                class="w-full focus:outline-none"
                type="text"
                placeholder="Search"
              >
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>
