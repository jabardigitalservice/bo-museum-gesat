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
              <input v-model="params.search" class="w-full focus:outline-none" type="text" placeholder="Search">
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" @click="onSearch" />
            </div>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full  overflow-x-auto">
        <table v-if="render" class="w-full">
          <thead class="bg-primary">
            <tr>
              <th v-for="x in dataHeader" :key="x" scope="col" class="thead">
                {{ x }}
              </th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="(data, i) in dataReservasi" :key="i">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ data.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  {{ data.date }}
                </div>
                <div class="text-sm">
                  {{ data.start_time && data.end_time ? `${data.start_time} - ${data.end_time}` : '' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                  :class="data.approval_status === 'not_yet_approved' ? 'bg-yellow' : data.approval_status === 'already_approved' ? 'bg-primary' : 'bg-red'"
                >
                  {{ data.approval_status ? findStatus(data.approval_status) : '' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span>
                  {{ data.description }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  {{ data.date }}
                </div>
                <div class="text-sm">
                  {{ data.start_time && data.end_time ? `${data.start_time} - ${data.end_time}` : '' }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <i
                  v-show="data.approval_status === 'not_yet_approved'"
                  class="bx bx-trash bx-sm cursor-pointer text-red"
                  title="Klik untuk menghapus reservasi"
                  @click="deleteData(data.id)"
                />
                <i
                  class="bx bx-info-circle bx-sm cursor-pointer text-blue"
                  title="Klik untuk melihat detail reservasi"
                  @click="showModalDetail(data)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <modal name="filter" :adaptive="true" :height="450">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          FILTER DATA RESERVASI
        </div>
        <div>
          <label for="title" class="block text-sm">
            Rentang Tanggal
          </label>
          <div class="flex mt-1">
            <date-picker
              v-model="params.start_date"
              placeholder="Tanggal Awal"
              format="yyyy-MM-dd"
              class="form-input"
            />
            <date-picker
              v-model="params.end_date"
              placeholder="Tanggal Akhir"
              format="yyyy-MM-dd"
              class="form-input"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm">
            Status
          </label>
          <div class="mt-1">
            <select v-model="params.approval_status" name="approval_status" required class="form-input">
              <option v-for="item in statusReservation" :key="item.key" :value="item.key">
                {{ item.value }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="reset"
          >
            Clear
          </button>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="onFilter"
          >
            Submit
          </button>
        </div>
      </div>
    </modal>
    <modal name="sort" :adaptive="true" :height="450">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          SORT DATA RESERVASI
        </div>
        <div>
          <label for="title" class="block text-sm">
            Judul Kegiatan
          </label>
          <div class="mt-1">
            <select v-model="params.sortBy" name="approval_status" required class="form-input">
              <option v-for="item in optionsSortBy" :key="item.key" :value="item.key">
                {{ item.value }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm">
            Urutkan berdasarkan
          </label>
          <div class="mt-1">
            <select v-model="params.orderBy" name="approval_status" required class="form-input">
              <option v-for="item in optionsOrderBy" :key="item.key" :value="item.key">
                {{ item.value }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="reset"
          >
            Clear
          </button>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="onSorting"
          >
            Submit
          </button>
        </div>
      </div>
    </modal>
    <modal name="add" :adaptive="true" :height="`auto`">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          TAMBAH RESERVASI BARU
        </div>
        <div>
          <label for="title" class="block text-sm">
            Judul Kegiatan
          </label>
          <div class="mt-1">
            <input
              v-model="form.title"
              name="title"
              type="text"
              autocomplete="title"
              required
              class="form-input"
            >
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm">
            Resource / Aset
          </label>
          <div class="mt-1">
            <select v-model="form.asset_id" name="asset_id" required class="form-input">
              <option v-for="item in dataAsset" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label for="title" class="block text-sm">
            Tanggal
          </label>
          <div class="mt-1">
            <date-picker
              v-model="form.date"
              placeholder="YYYY-MM-DD"
              class="form-input"
            />
          </div>
        </div>
        <div>
          <label for="title" class="block text-sm">
            Rentang Waktu
          </label>
        </div>
        <div>
          <div class="md:grid md:grid-cols-5 text-sm">
            <div class="md:col-span-1 flex items-center">
              Jam Mulai
            </div>
            <div class="md:col-span-4">
              <select v-model="form.start_time" name="start_time" required class="form-input">
                <option v-for="(item, idx) in rangeTimes" :key="idx" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="md:grid md:grid-cols-5 text-sm">
            <div class="md:col-span-1 flex items-center">
              Jam Selesai
            </div>
            <div class="md:col-span-4">
              <select v-model="form.end_time" name="end_time" required class="form-input">
                <option v-for="(item, idx) in rangeTimes" :key="idx" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label for="description" class="block text-sm">
            Catatan / Deskripsi Kegiatan
          </label>
          <div class="mt-1">
            <textarea
              v-model="form.description"
              name="description"
              class="form-input"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="addReservation"
          >
            Submit
          </button>
        </div>
      </div>
    </modal>
    <modal name="detail" :adaptive="true" :height="`auto`">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          DETAIL RESERVASI
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Judul Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.title || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Waktu Reservasi
          </div>
          <div class="md:col-span-3">
            {{ `${detailData.date}, pukul ${detailData.start_time} - ${detailData.end_time}` }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Catatan Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.description || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Status
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_status ? findStatus(detailData.approval_status) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Catatan Admin FO
          </div>
          <div class="md:col-span-3">
            {{ detailData.note || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Reservasi Dibuat
          </div>
          <div class="md:col-span-3">
            {{ detailData.created_at ? momentFormatDate(detailData.created_at) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Pembaruan
          </div>
          <div class="md:col-span-3">
            {{ detailData.updated_at ? momentFormatDate(detailData.updated_at) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Verifikasi Admin
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_date ? momentFormatDate(detailData.approval_date) : '-' }}
          </div>
        </div>
        <div>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-blue text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="closeModalDetail"
          >
            Close
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
// import axios from '@nuxtjs/axios'
import Pagination from '~/components/Pagination.vue'
import { rangeTimes, statusReservation, optionsSortBy, optionsOrderBy } from '~/assets/constant/enum'
import {
  momentFormatDate
} from '~/utils'
export default {
  components: { Pagination },
  layout: 'admin',
  data () {
    return {
      errors: null,
      render: true,
      activeData: 1,
      meta: {},
      dataHeader: [
        'Judul Kegiatan',
        'Waktu Reservasi',
        'Status',
        'Catatan',
        'Tanggal Diibuat',
        'Aksi'
      ],
      rangeTimes,
      statusReservation,
      optionsSortBy,
      optionsOrderBy,
      form: {
        title: null,
        asset_id: null,
        description: null,
        date: null,
        start_time: null,
        end_time: null
      },
      dataReservasi: [],
      dataAsset: [],
      detailData: {},
      params: {
        search: null,
        asset_id: null,
        approval_status: null,
        start_date: null,
        end_date: null,
        sortBy: 'created_at',
        orderBy: null,
        page: null,
        perPage: null
      },
      momentFormatDate
    }
  },
  watch: {
    activeData (val) {
      this.params.page = val
      this.getDataReservation()
    },
    'form.date' () {
      if (this.form.date) {
        this.form.date = momentFormatDate(this.form.date)
      }
      console.log(this.form.date)
    },
    'params.start_date' () {
      if (this.params.start_date) {
        this.params.start_date = momentFormatDate(this.params.start_date)
      }
    },
    'params.end_date' () {
      if (this.params.end_date) {
        this.params.end_date = momentFormatDate(this.params.end_date)
      }
    }
  },
  created () {
    // TODO: appy keycloack
    // this.$axios.defaults.headers.common.Authorization = 'Bearer ' + process.env.KEYCLOACK_TOKEN
    this.reset()
    this.getAssetList()
    this.getDataReservation()
  },
  methods: {
    reset () {
      this.params.search = null
      this.params.asset_id = null
      this.params.approval_status = null
      this.params.start_date = null
      this.params.end_date = null
      this.params.sortBy = null
      this.params.orderBy = null
      this.params.page = null
      this.params.perPage = null
      this.refreshTable()
    },
    async refreshTable () {
      this.render = false
      this.getDataReservation()
      await this.$nextTick()
      this.render = true
    },
    customFormatter (date) {
      this.form.date = momentFormatDate(date)
      console.log(date, this.form.date)
    },
    findStatus (stat) {
      const findStats = statusReservation.find(el => el.key === stat)
      return findStats.value
    },
    async getAssetList () {
      try {
        const response = await this.$axios.get('/asset/list')
        this.dataAsset = response ? response.data.data : []
      } catch (e) {
        this.errors = e
      }
    },
    async getDataReservation () {
      try {
        const response = await this.$axios.get('/reservation', { params: this.params })
        this.dataReservasi = response ? response.data.data : []
        this.meta = response ? response.data.meta : {}
      } catch (e) {
        this.errors = e
      }
    },
    async addReservation () {
      try {
        await this.$axios.post('reservation', this.form)
        this.$modal.hide('add')
        this.refreshTable()
      } catch (e) {
        this.errors = e
      }
    },
    async deleteData (id) {
      const swal = this.$swal
      const toast = this.$toast
      const {
        value: isConfirm
      } = await swal.fire({
        title: 'Hapus Data?',
        showCancelButton: true,
        confirmButtonText: '<i class="bx bx-sm bx-check" /> OK',
        cancelButtonText: '<i class="bx bx-sm bx-close" /> Cancel',
        icon: 'info',
        reverseButtons: true
      })
      if (isConfirm) {
        try {
          await this.$axios.delete(`/reservation/${id}`)
          this.refreshTable()
          toast.success('Berhasil menghapus data', {
            icon: 'check',
            iconPack: 'fontawesome',
            duration: 5000
          })
        } catch (e) {
          swal.fire('Terjadi kesalahan', 'Silakan hubungi Admin', 'error')
        }
      }
    },
    onSearch () {
      this.refreshTable()
    },
    onFilter () {
      this.$modal.hide('filter')
      this.refreshTable()
    },
    onSorting () {
      this.$modal.hide('sort')
      this.refreshTable()
    },
    changeActivePagination (val) {
      this.activeData = val
      this.refreshTable()
    },
    showModalFilter () {
      this.$modal.show('filter')
    },
    showModalSort () {
      this.$modal.show('sort')
    },
    showModalAdd () {
      this.$modal.show('add')
    },
    showModalDetail (data) {
      this.detailData = data
      this.$modal.show('detail')
    },
    closeModalDetail () {
      this.$modal.hide('detail')
    }
  }
}
</script>
