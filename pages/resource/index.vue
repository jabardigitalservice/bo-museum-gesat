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
              <input v-model="dataSearch" class="w-full focus:outline-none" type="text" placeholder="Search" @keyup.enter="searchResource">
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" @click="searchResource" />
            </div>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full  overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary">
            <tr>
              <th v-for="header in dataHeader" :key="header" scope="col" class="thead">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="resource in dataResource" :key="resource.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <span> {{ resource.name }} </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span> {{ resource.description }} </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{'bg-red': resource.status === 'not_active'}"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary text-white capitalize"
                >
                  {{ resource.status === 'active' ? 'aktif' : 'tidak aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                <span> {{ momentFormatDate(resource.created_at) }} </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <i class="bx bx-edit bx-sm cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="metaResource.last_page" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <modal
      name="filter"
      :min-width="320"
      :max-width="500"
      width="80%"
      height="auto"
      :adaptive="true"
    >
      <div class="bg-gray5 w-full h-full p-3">
        <h2 class="font-medium">
          Filter Berdasarkan :
        </h2>
        <div class="flex flex-col">
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Status</label>
            <select v-model="dataFilter.status" name="status" class="focus:outline-none rounded p-3 appearance-none">
              <option v-for="status in optionsStatusResource" :key="status.id" :value="status">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <button class="btn bg-primary" @click.stop="applyFilter">
              Terapkan
            </button>
            <button class="btn bg-yellow" @click.stop="resetFilter">
              Reset
            </button>
          </div>
        </div>
      </div>
    </modal>
    <modal
      name="sort"
      :min-width="320"
      :max-width="500"
      width="80%"
      height="auto"
      :adaptive="true"
    >
      <div class="bg-gray5 w-full h-full p-3">
        <div class="flex flex-col">
          <div class="w-full flex flex-col">
            <label class="font-medium" for="sort">Urut Berdasarkan :</label>
            <select v-model="dataSort.sortBy" name="sort" class="focus:outline-none rounded p-3 appearance-none">
              <option v-for="sort in optionsSortResource" :key="sort.id" :value="sort">
                {{ sort.label }}
              </option>
            </select>
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="order">Urutan :</label>
            <select v-model="dataSort.orderBy" name="order" class="focus:outline-none rounded p-3 appearance-none capitalize">
              <option v-for="order in optionsOrderBy" :key="order.key" class="capitalize" :value="order">
                {{ order.value }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <button class="btn bg-primary" @click.stop="applySort">
              Terapkan
            </button>
            <button class="btn bg-yellow" @click.stop="resetSort">
              Reset
            </button>
          </div>
        </div>
      </div>
    </modal>
    <modal name="add" :adaptive="true">
      This is an example add
    </modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Pagination from '~/components/Pagination.vue'
import { optionsStatusResource, optionsSortResource, optionsOrderBy } from '~/assets/constant/enum'

import {
  momentFormatDate
} from '~/utils'
export default {
  components: { Pagination },
  middleware: ['auth', 'admin'],
  layout: 'admin',
  data () {
    return {
      activeData: 1,
      dataHeader: [
        'Nama',
        'Deskripsi',
        'Status',
        'Tanggal dibuat',
        'Aksi'
      ],
      momentFormatDate,
      dataSearch: '',
      params: {
        sortBy: 'name',
        orderBy: 'asc'
      },
      optionsStatusResource,
      optionsOrderBy,
      optionsSortResource,
      dataFilter: {
        status: optionsStatusResource[0]
      },
      dataSort: {
        sortBy: optionsSortResource[0],
        orderBy: optionsOrderBy[0]
      }
    }
  },
  computed: {
    ...mapGetters('resource', [
      'dataResource',
      'metaResource'
    ])
  },
  watch: {
    activeData (val) {
      // console.log(val)
    }
  },
  created () {
    this.fetchResource(this.params)
  },
  methods: {
    fetchResource (params = {}) {
      this.$axios.get('/asset', { params }).then((response) => {
        this.$store.commit('resource/SET_RESOURCE', response.data)
      })
    },
    applySort () {
      this.fetchResource({ sortBy: this.dataSort.sortBy.value, orderBy: this.dataSort.orderBy.key })
      this.$modal.hide('sort')
    },
    resetSort () {
      this.dataSort.sortBy = optionsSortResource[0]
      this.dataSort.orderBy = optionsOrderBy[0]
      this.fetchResource(this.params)
      this.$modal.hide('sort')
    },
    applyFilter () {
      this.fetchResource({ ...this.params, status: this.dataFilter.status.value })
      this.$modal.hide('filter')
    },
    resetFilter () {
      this.dataFilter.status = optionsStatusResource[0]
      this.fetchResource(this.params)
      this.$modal.hide('filter')
    },
    searchResource () {
      this.fetchResource({ ...this.params, name: this.dataSearch })
    },
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
