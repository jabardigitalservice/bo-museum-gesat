<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Resource / Aset
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
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="x in 4" :key="x">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
                      alt=""
                    >
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      Jane Cooper
                    </div>
                    <div class="text-sm text-gray-500">
                      jane.cooper@example.com
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  Regional Paradigm Technician
                </div>
                <div class="text-sm text-gray-500">
                  Optimization
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red text-white"
                >
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span> Admin </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <i class="bx bx-edit bx-sm cursor-pointer" />
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
    <modal name="add" :adaptive="true">
      This is an example add
    </modal>
  </div>
</template>
<script>
import Pagination from '~/components/Pagination.vue'
export default {
  components: { Pagination },
  layout: 'admin',
  data () {
    return {
      activeData: 1,
      dataHeader: [
        'Nama',
        'Title',
        'Status',
        'Role'
      ]
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
<style scoped>
</style>
