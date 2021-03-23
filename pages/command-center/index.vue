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
            <button v-if="isAdmin" class="btn bg-primary">
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
      <!-- table -->
      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <table v-if="render" class="w-full">
          <thead class="bg-primary">
            <tr>
              <th
                v-for="head in dataHeader"
                :key="head"
                scope="col"
                class="thead"
              >
                {{ head }}
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="data in dataDisabledDate" :key="data.id">
              <td style="min-width: 256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ momentFormatDateId(data.date) }}
                </div>
              </td>
              <td style="min-width: 256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ data.note }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
    </div>
  </div>
</template>

<script>
import Pagination from '~/components/Pagination.vue'
import { isAdmin as admin, momentFormatDateId } from '~/utils'
export default {
  components: {
    Pagination
  },
  layout: 'admin',
  data () {
    return {
      render: true,
      errors: null,
      dataHeader: ['Tanggal Tutup', 'Keterangan'],
      dataDisabledDate: [],
      momentFormatDateId,
      activeData: 1,
      meta: {},
      params: {
        page: null
      }
    }
  },
  computed: {
    isAdmin () {
      return admin(this.$auth)
    }
  },
  watch: {
    activeData (val) {
      this.params.page = val
      this.getDisabledDateData()
    }
  },
  created () {
    this.getDisabledDateData()
  },
  methods: {
    async getDisabledDateData () {
      try {
        const res = await this.$axios.$get('/close-days', { params: this.params })
        this.dataDisabledDate = res.data
        this.meta = res ? res.meta : {}
      } catch (error) {
        this.errors = error
      }
    },
    changeActivePagination (val) {
      this.params.page = val
      this.activeData = val
      this.refreshTable()
    },
    async refreshTable () {
      this.render = false
      this.getDisabledDateData()
      await this.$nextTick()
      this.render = true
    }
  }
}
</script>
