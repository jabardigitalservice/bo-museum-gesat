<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Reservasi
      </h1>
      <Statistik />
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3 ">
        <div class="w-full lg:w-1/3 my-1">
          <div class="w-1/2 lg:w-1/3">
            <button v-show="!isAdmin" class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-2/3 flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-2 w-full">
              <div class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center">
                <input v-model="params.search" class="w-full focus:outline-none" type="text" placeholder="Search">
                <i class="text-gray4 bx bx-search bx-sm cursor-pointer" @click="onSearch" />
              </div>
            </div>
            <div class="md:col-span-3 w-full">
              <div class="md:grid md:grid-cols-3 flex item-center">
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-blue px-2" @click="showModalFilter">
                    <i class="bx bx-filter bx-sm" />
                    <span>Filter</span>
                  </button>
                </div>
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-yellow px-2" @click="showModalSort">
                    <i class="bx bx-sort-up bx-sm" />
                    <span>Urutkan</span>
                  </button>
                </div>
                <div class="md:col-span-1 ml-2">
                  <button class="btn" :class="isHasParams ? 'bg-red border border-red' : 'bg-white border border-grayText'" @click="initParams">
                    <span class="hover:text-black" :class="isHasParams ? 'text-white' : 'text-grayText'">
                      Reset
                    </span>
                  </button>
                </div>
              </div>
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
                  {{ data.date && data.start_time && data.end_time ? getDisplayDateTimeManually(data.date, data.start_time, data.end_time) : '' }}
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
                  {{ data.created_at ? getDisplayDateTime(data.created_at) : '' }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <i
                  class="bx bx-info-circle bx-sm cursor-pointer text-blue"
                  title="Klik untuk melihat detail reservasi"
                  @click="showModalDetail(data)"
                />
                <i
                  v-show="!isAdmin && data.approval_status === 'not_yet_approved'"
                  class="bx bx-trash bx-sm cursor-pointer text-red"
                  title="Klik untuk menghapus reservasi"
                  @click="deleteData(data.id)"
                />
                <i
                  v-show="isAdmin && data.approval_status === 'not_yet_approved'"
                  class="bx bx-calendar-check bx-sm cursor-pointer text-primary"
                  title="Setujui reservasi"
                  @click="verifikasiData('approve', data.id)"
                />
                <i
                  v-show="isAdmin && data.approval_status === 'not_yet_approved'"
                  class="bx bx-calendar-x bx-sm cursor-pointer text-red"
                  title="Tolak reservasi"
                  @click="verifikasiData('reject', data.id)"
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
              class="form-input"
            />
            <date-picker
              v-model="params.end_date"
              placeholder="Tanggal Akhir"
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
        <div v-show="isAdmin">
          <label for="asset_id" class="block text-sm">
            Resource / Aset
          </label>
          <div class="mt-1">
            <select v-model="params.asset_id" name="asset_id" required class="form-input">
              <option v-for="item in dataAsset" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="clearFilter"
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
            @click="clearSortby"
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
            <span class="text-red">*</span>
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
          <label for="asset_id" class="block text-sm">
            Resource / Aset
            <span class="text-red">*</span>
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
            <span class="text-red">*</span>
          </label>
          <div class="mt-1">
            <date-picker
              v-model="form.date"
              placeholder="DD MMM YYYY"
              class="form-input"
              :disabled="isDisabledSelectDate"
              :disabled-dates="disabledDates"
            />
          </div>
        </div>
        <div>
          <label for="title" class="block text-sm">
            Daftar Reservasi yang sudah ada
          </label>
          <div v-if="dataVerifiedReservasi.length > 0" class="mt-1">
            <span
              v-for="(item, idx) in dataVerifiedReservasi"
              :key="idx"
              class="px-1 py-1 mr-1 text-xs bg-red text-white rounded"
              :class="item.approval_status === 'already_approved' ? 'bg-red' : 'bg-yellow'"
            >
              {{ item.start_time && item.end_time ? `${momentFormatTime(item.start_time)} - ${momentFormatTime(item.end_time)}` : '' }}
            </span>
            <div class="mt-1">
              <i class="bx bxs-circle text-yellow" />
              <span class="text-xs text-gray4">Menunggu Apporval admin</span>
              <i class="bx bxs-circle text-red" />
              <span class="text-xs text-gray4">Approved</span>
            </div>
          </div>
          <div v-else-if="dataVerifiedReservasi.length === 0 && form.asset_id && form.date" class="mt-1 text-sm text-gray4">
            Belum ada reservasi untuk resource dan tanggal yang dipilih
          </div>
          <div v-else class="mt-1 text-sm text-gray4">
            Silahkan pilih resource dan tanggal untuk melihat ketersediaan jam pakai
          </div>
        </div>
        <div>
          <label for="title" class="block text-sm">
            Rentang Waktu (pilih diluar range daftar reservasi yang sudah ada)
          </label>
        </div>
        <div>
          <div class="md:grid md:grid-cols-6 text-sm space-x-2">
            <div class="md:col-span-1 flex items-center">
              Jam Mulai
              <span class="text-red">*</span>
            </div>
            <div class="md:col-span-2">
              <select v-model="form.start_time" name="start_time" required class="form-input" :disabled="isDisabledSelectTime">
                <option v-for="(item, idx) in rangeTimes" :key="idx" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
            <div class="md:col-span-1 flex items-center">
              Jam Selesai
              <span class="text-red">*</span>
            </div>
            <div class="md:col-span-2">
              <select v-model="form.end_time" name="end_time" required class="form-input" :disabled="isDisabledSelectTime">
                <option v-for="(item, idx) in rangeTimes" :key="idx" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="md:grid md:grid-cols-5 text-sm" />
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

        <div class="flex space-x-4">
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="clearFormReservation"
          >
            Clear
          </button>
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
        <div v-show="isAdmin" class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Nama Pegawai
          </div>
          <div class="md:col-span-3">
            {{ detailData.user_fullname || '-' }}
          </div>
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
            Resource / Aset
          </div>
          <div class="md:col-span-3">
            {{ detailData.asset_name || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Waktu Reservasi
          </div>
          <div class="md:col-span-3">
            <div>{{ detailData.date && detailData.start_time && detailData.end_time ? getDisplayDateTimeManually(detailData.date, detailData.start_time, detailData.end_time) : '-' }}</div>
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
            {{ detailData.created_at ? getDisplayDateTime(detailData.created_at) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Pembaruan
          </div>
          <div class="md:col-span-3">
            {{ detailData.updated_at ? getDisplayDateTime(detailData.updated_at) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Verifikasi Admin
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_date ? getDisplayDateTime(detailData.approval_date) : '-' }}
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
import Pagination from '~/components/Pagination.vue'
import { statusReservation, optionsSortBy, optionsOrderBy } from '~/assets/constant/enum'
import {
  generateTimes,
  momentFormatDate,
  momentFormatDateId,
  momentFormatTime,
  momentFormatTimeToTz,
  momentGetCurrentDate,
  filterTimeAfterCurrent,
  isAdmin as admin
} from '~/utils'
export default {
  components: {
    Pagination
  },
  layout: 'admin',
  data () {
    return {
      errors: null,
      render: true,
      activeData: 1,
      meta: {},
      dataUser: {},
      dataHeader: [
        'Judul Kegiatan',
        'Waktu Reservasi',
        'Status',
        'Catatan',
        'Reservasi Dibuat',
        'Aksi'
      ],
      disabledDates: {
        // disable datepicker from unlimited past to yesterday
        // note: 86400000 is in ms = 1 day
        to: new Date(Date.now() - 86400000)
      },
      rangeTimes: [],
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
      dataVerifiedReservasi: [],
      dataAsset: [],
      detailData: {},
      params: {
        search: null,
        asset_id: null,
        approval_status: null,
        start_date: null,
        end_date: null,
        sortBy: null,
        orderBy: null,
        page: null,
        perPage: null
      },
      isHasParams: false,
      generateTimes,
      momentFormatDate,
      momentFormatDateId,
      momentFormatTime,
      momentFormatTimeToTz,
      admin,
      isDisabledSelectDate: true,
      isDisabledSelectTime: true
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
      this.getDataReservation()
    },
    'form.asset_id' () {
      if (this.form.asset_id) {
        this.isDisabledSelectDate = false
      }
    },
    'form.date' () {
      this.form.date = momentFormatDate(this.form.date)
      if (this.form.date) {
        this.getVerifiedReservation()
        this.isDisabledSelectTime = false
        if (this.form.date === momentGetCurrentDate()) {
          this.rangeTimes = filterTimeAfterCurrent(this.rangeTimes)
        } else {
          this.rangeTimes = generateTimes()
        }
      }
    },
    'form.start_time' () {
      this.onSelectTime()
    },
    'form.end_time' () {
      this.onSelectTime()
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
    this.rangeTimes = generateTimes()
    this.initParams()
    this.getAssetList()
  },
  methods: {
    initParams () {
      this.params.search = null
      this.params.asset_id = null
      this.params.approval_status = null
      this.params.start_date = null
      this.params.end_date = null
      this.params.sortBy = null
      this.params.orderBy = null
      this.params.page = null
      this.params.perPage = null
      this.isHasParams = false
      this.refreshTable()
    },
    checkParams () {
      // check if another params not null, if true: reset button still red / isHasparams = true
      Object.values(this.params).find(element => element !== null) === undefined ? this.isHasParams = false : this.isHasParams = true
    },
    clearFilter () {
      this.params.approval_status = null
      this.params.start_date = null
      this.params.end_date = null
      this.checkParams()
      this.refreshTable()
    },
    clearSortby () {
      this.params.sortBy = null
      this.params.orderBy = null
      this.checkParams()
      this.refreshTable()
    },
    clearFormReservation () {
      this.form.title = null
      this.form.asset_id = null
      this.form.description = null
      this.form.date = null
      this.form.start_time = null
      this.form.end_time = null
      this.dataVerifiedReservasi = []
    },
    async refreshTable () {
      this.render = false
      this.getDataReservation()
      await this.$nextTick()
      this.render = true
    },
    customFormatter (date) {
      this.form.date = momentFormatDate(date)
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
    async getVerifiedReservation () {
      try {
        const response = await this.$axios.get('/reserved', { params: this.form })
        this.dataVerifiedReservasi = response ? response.data.data : []
      } catch (errors) {
        this.errors = errors
      }
    },
    async addReservation () {
      if (this.form.date && this.form.start_time && this.form.end_time) {
        this.form.start_time = `${this.form.date} ${this.form.start_time}`
        this.form.end_time = `${this.form.date} ${this.form.end_time}`
      }
      try {
        await this.$axios.post('reservation', this.form)
        await this.$nextTick()
        this.$modal.hide('add')
        this.$swal.fire('Success', 'Silakan cek email, harap tunggu konfirmasi dari admin', 'info')
        this.refreshTable()
      } catch (err) {
        if (err.response && err.response.status === 422) {
          const { errors } = err.response.data || {}
          const arrayErrors = errors ? Object.values(errors) : []
          arrayErrors.forEach(element => this.$toast.error(element, {
            icon: 'times',
            iconPack: 'fontawesome',
            duration: 5000
          }))
        }
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
        type: 'warning',
        reverseButtons: true
      })
      if (isConfirm) {
        try {
          await this.$axios.delete(`/reservation/${id}`)
          this.refreshTable()
          toast.success('Berhasil menghapus data', {
            type: 'check',
            iconPack: 'fontawesome',
            duration: 5000
          })
        } catch (e) {
          swal.fire('Terjadi kesalahan', 'Silakan hubungi Admin', 'error')
        }
      }
    },
    async verifikasiData (approval, id) {
      const swal = this.$swal
      const toast = this.$toast
      const {
        value: confirmation
      } = await swal.fire({
        title: approval === 'approve' ? 'Setujui Reservasi?' : 'Tolak Reservasi?',
        showCancelButton: true,
        confirmButtonText: '<i class="bx bx-sm bx-check" /> OK',
        cancelButtonText: '<i class="bx bx-sm bx-close" /> Cancel',
        type: approval === 'approve' ? 'success' : 'error',
        input: 'text',
        reverseButtons: true
      })
      if (confirmation) {
        try {
          await this.$axios.put(`/reserved/${id}`, {
            approval_status: approval === 'approve' ? 'already_approved' : 'rejected',
            note: confirmation
          })
          this.refreshTable()
          swal.fire(
            'Success',
            'Verifikasi data reservasi berhasil',
            'success'
          )
        } catch (e) {
          swal.fire('Terjadi kesalahan', 'Silakan hubungi Admin', 'error')
        }
      }
      if (confirmation === undefined || !confirmation) {
        toast.error('Harap isi catatan verifikasi', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    onSearch () {
      this.checkParams()
      this.refreshTable()
    },
    onFilter () {
      this.checkParams()
      if (this.params.start_date <= this.params.end_date) {
        this.$modal.hide('filter')
        this.refreshTable()
      } else {
        this.$toast.error('Tanggal awal harus kurang dari atau sama dengan tanggal akhir', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    onSorting () {
      this.checkParams()
      this.$modal.hide('sort')
      this.refreshTable()
    },
    changeActivePagination (val) {
      this.activeData = val
      this.params.page = val
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
    },
    getDisplayDateTime (date) {
      if (date) {
        const dateString = momentFormatTimeToTz(date)
        return `${dateString}`
      }
      return '-'
    },
    getDisplayDateTimeManually (date, startTime, endTime) {
      if (date && startTime && endTime) {
        const dateString = momentFormatDateId(date)
        const startTimeString = momentFormatTime(startTime)
        const endTimeString = momentFormatTime(endTime)
        return `${dateString}, pukul ${startTimeString}-${endTimeString}`
      }
      return '-'
    },
    onSelectTime () {
      if (this.form.start_time && this.form.end_time && this.form.start_time > this.form.end_time) {
        this.$toast.error('Jam mulai harus kurang dari jam selesai', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    }
  }
}
</script>
