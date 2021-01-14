<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Reservasi
      </h1>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3 ">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-1/2 lg:w-1/4">
            <button class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-1/2 flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="w-1/2 lg:w-1/4 my-1 pl-1">
            <button class="btn bg-yellow" @click="showModalSort">
              <i class="bx bx-sort-up bx-sm" />
              <span>Urutkan</span>
            </button>
          </div>
          <div class="w-1/2 lg:w-1/4 my-1 lg:pl-1">
            <button class="btn bg-blue" @click="showModalFilter">
              <i class="bx bx-filter bx-sm" />
              <span>Filter</span>
            </button>
          </div>
          <div class="w-full lg:w-1/2 my-1">
            <div class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center">
              <input class="w-full focus:outline-none" type="text" placeholder="Search">
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full  overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary">
            <tr>
              <th v-for="x in dataHeader" :key="x" scope="col" class="thead">
                {{ x }}
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="x in 4" :key="x">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  Judul Kegiatan
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  DD/MM/YYYY
                </div>
                <div class="text-sm">
                  HH:mm
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red text-white"
                >
                  Ditolak
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span>
                  Catatan
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  DD/MM/YYYY
                </div>
                <div class="text-sm">
                  HH:mm
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <i class="bx bx-trash bx-sm cursor-pointer text-red" title="Klik untuk menghapus reservasi" />
                <i class="bx bx-info-circle bx-sm cursor-pointer text-blue" title="Klik untuk melihat detail reservasi" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="6" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <modal name="filter" :adaptive="true">
      This is an example filter
    </modal>
    <modal name="sort" :adaptive="true">
      This is an example sort
    </modal>
    <modal name="add" :adaptive="true" :height="`auto`">
      <div class="p-8">
        <div class="window-header mb-2">
          TAMBAH RESERVASI BARU
        </div>
        <form class="space-y-4 mt-4" action="#" method="POST">
          <div>
            <label for="title" class="block text-sm text-gray7">
              Judul Kegiatan
            </label>
            <div class="mt-1">
              <input
                name="title"
                type="text"
                autocomplete="title"
                required
                class="form-input"
              >
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm text-gray7">
              Resource / Aset
            </label>
            <div class="mt-1">
              <input
                name="asset"
                type="text"
                autocomplete="asset"
                required
                class="form-input"
              >
            </div>
          </div>
          <div>
            <label for="title" class="block text-sm text-gray7">
              Tanggal
            </label>
            <div class="mt-1">
              <input
                name="title"
                type="text"
                autocomplete="title"
                required
                class="form-input"
              >
            </div>
          </div>
          <div>
            <label for="title" class="block text-sm text-gray7">
              Rentang Waktu
            </label>
            <div>
              <span
                v-for="(time, idx) in rangeTimes"
                :key="idx"
                class="px-2 mr-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-primary hover:bg-blue text-white cursor-pointer"
              >
                {{ time }}
              </span>
            </div>
          </div>
          <div>
            <label for="description" class="block text-sm text-gray7">
              Catatan / Deskripsi Kegiatan
            </label>
            <div class="mt-1">
              <textarea
                name="description"
                class="form-input"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>
<script>
import Pagination from '~/components/Pagination.vue'
import { rangeTimes } from '~/assets/constant/enum'
export default {
  components: { Pagination },
  layout: 'admin',
  data () {
    return {
      activeData: 1,
      dataHeader: [
        'Judul Kegiatan',
        'Waktu Reservasi',
        'Status',
        'Catatan',
        'Tanggal Update',
        'Aksi'
      ],
      rangeTimes
    }
  },
  watch: {
    activeData (val) {
      // console.log(val)
    }
  },
  methods: {
    changeActivePagination (val) {
      this.activeData = val
    },
    showModalFilter () {
      this.$modal.show('filter')
    },
    showModalSort () {
      this.$modal.show('sort')
    },
    showModalAdd () {
      this.$modal.show('add')
    }
  }
}
</script>
