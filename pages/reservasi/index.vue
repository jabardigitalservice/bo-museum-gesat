<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        List Reservasi
      </h1>
      <Statistik />
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3 ">
        <div v-if="false" class="w-full lg:w-1/3 my-1">
          <div class="w-1/2 lg:w-1/3">
            <button v-if="!isAdmin" class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
        <div class="w-full flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
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
        <table class="w-full">
          <thead class="bg-primary">
            <tr>
              <th v-for="x in dataHeader" :key="x" scope="col" class="thead">
                {{ x }}
              </th>
            </tr>
          </thead>
          <tbody v-if="dataReservasi.length > 0" class="tbody">
            <tr v-for="(data, i) in dataReservasi" :key="i">
              <td style="min-width:256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ data.user_fullname }}
                </div>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ data.title }}
                </div>
              </td>
              <td style="min-width:280px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  {{ data.date && data.start_time && data.end_time ? getDisplayDateTimeManually(data.date, data.start_time, data.end_time) : '' }}
                </div>
              </td>
              <td v-if="false" class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                  :class="data.approval_status === 'NOT_YET_APPROVED' ? 'bg-yellow' : data.approval_status === 'ALREADY_APPROVED' ? 'bg-primary' : 'bg-red'"
                >
                  {{ data.approval_status ? findStatus(data.approval_status) : '' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span>
                  {{ data.description }}
                </span>
              </td>
              <td style="min-width:256px" class="px-6 py-4 whitespace-nowrap">
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
                  v-if="!isAdmin && data.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-trash bx-sm cursor-pointer text-red"
                  title="Klik untuk menghapus reservasi"
                  @click="deleteData(data.id)"
                />
                <i
                  v-if="isAdmin && data.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-calendar-check bx-sm cursor-pointer text-primary"
                  title="Setujui reservasi"
                  @click="verifikasiData('approve', data.id)"
                />
                <i
                  v-if="isAdmin && data.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-calendar-x bx-sm cursor-pointer text-red"
                  title="Tolak reservasi"
                  @click="verifikasiData('reject', data.id)"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else class="tbody">
            <tr>
              <td colspan="6" class="w-full p-4 text-center text-gray3">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <modal
      name="filter"
      height="70%"
      :adaptive="true"
    >
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
        <div v-if="false">
          <label class="block text-sm">
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
        <div v-if="isAdmin">
          <label for="asset_id" class="block text-sm">
            Ruangan / Aset
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
            :class="checkformIsEmpty ? 'btn-disable' : 'btn-primary'"
            :disabled="checkformIsEmpty"
            @click="onFilter"
          >
            Submit
          </button>
        </div>
      </div>
    </modal>
    <modal
      name="sort"
      height="auto"
      :adaptive="true"
    >
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
            :class="checkSortIsEmpty ? 'btn-disable' : 'btn-primary'"
            :disabled="checkSortIsEmpty"
            @click="onSorting"
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
        <div v-if="isAdmin" class="md:grid md:grid-cols-5 text-sm">
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
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Status
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_status ? findStatus(detailData.approval_status) : '-' }}
          </div>
        </div>
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm">
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
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm">
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
      activeData: 1,
      meta: {},
      dataUser: {},
      dataHeader: [
        'Nama',
        'Judul Kegiatan',
        'Waktu Reservasi',
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
      admin
    }
  },
  computed: {
    isAdmin () {
      return admin(this.$auth)
    },
    checkformIsEmpty () {
      return this.isAdmin ? this.formIsEmptyAdmin() : this.formIsEmptyEmployee()
    },
    checkSortIsEmpty () {
      const isFormEmpty = [
        this.params.sortBy,
        this.params.orderBy
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
    }
  },
  watch: {
    activeData (val) {
      this.params.page = val
      this.getDataReservation()
    },
    'form.date' () {
      this.form.date = momentFormatDate(this.form.date)
      if (this.form.asset_id) {
        this.getVerifiedReservation()
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
    formIsEmptyAdmin () {
      const isFormEmpty = [
        this.params.start_date,
        this.params.end_date,
        this.params.asset_id
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
    },
    formIsEmptyEmployee () {
      const isFormEmpty = [
        this.params.start_date,
        this.params.end_date
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
    },
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
      this.params.asset_id = null
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
    async refreshTable () {
      await this.getDataReservation()
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
            approval_status: approval === 'approve' ? 'ALREADY_APPROVED' : 'REJECTED',
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
<style scoped>
.btn-disable {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium text-white bg-gray4;
}

.btn-disable:focus {
  @apply outline-none;
}

.btn-primary {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white;
}

.btn-primary:focus {
  @apply outline-none;
}
</style>
