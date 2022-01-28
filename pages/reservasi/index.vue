<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <Title id="list-reservasi">
        List Reservasi
      </Title>
      <Statistik />
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3 ">
        <div v-if="false" class="w-full lg:w-1/3 my-1">
          <div class="w-1/2 lg:w-1/3">
            <button v-if="!isAdmin" class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" aria-hidden="true" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
        <div class="w-full flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-2 w-full">
              <div class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center">
                <input v-model="params.search" class="w-full focus:outline-none" type="text" placeholder="Cari">
                <em title="Cari" class="text-gray4 bx bx-search bx-sm cursor-pointer" @click="onSearch" />
              </div>
            </div>
            <div class="md:col-span-3 w-full">
              <div class="md:grid md:grid-cols-3 flex item-center">
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-blue px-2" @click="showModalFilter">
                    <i class="bx bx-filter bx-sm" aria-hidden="true" />
                    <span>Filter</span>
                  </button>
                </div>
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-yellow px-2" @click="showModalSort">
                    <i class="bx bx-sort-up bx-sm" aria-hidden="true" />
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
        <table class="w-full" aria-describedby="list-reservasi">
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
                <em
                  class="bx bx-info-circle bx-sm cursor-pointer text-blue"
                  title="Klik untuk melihat detail reservasi"
                  @click="showModalDetail(data)"
                />
                <em
                  v-if="!isAdmin && data.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-trash bx-sm cursor-pointer text-red"
                  title="Klik untuk menghapus reservasi"
                  @click="deleteData(data.id)"
                />
                <em
                  v-if="isAdmin && data.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-calendar-check bx-sm cursor-pointer text-primary"
                  title="Setujui reservasi"
                  @click="verifikasiData('approve', data.id)"
                />
                <em
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
                <div class="text-md">
                  <div v-if="loading" class="div-spinner">
                    <div class="spinner" />
                  </div>
                  <div v-else>
                    Data tidak tersedia
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <BaseModal
      modal-name="filter"
      modal-title="Filter Data Reservasi"
    >
      <template #body>
        <div class="mb-4">
          <label for="title" class="block text-sm">
            Rentang Tanggal Kegiatan
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
        <div v-if="false" class="mb-4">
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
            Ruangan/Aset
          </label>
          <div class="mt-1">
            <select v-model="params.asset_id" name="asset_id" required class="form-input">
              <option v-for="item in dataAsset" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #buttons>
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="clearFilter"
        >
          Bersihkan
        </button>
        <button
          type="button"
          :class="checkformIsEmpty ? 'btn-disable' : 'btn-primary'"
          :disabled="checkformIsEmpty"
          @click="onFilter"
        >
          Terapkan
        </button>
      </template>
    </BaseModal>

    <!-- modal sort -->
    <BaseModal
      modal-name="sort"
      modal-title="Urutkan Data Reservasi"
    >
      <template #body>
        <div class="mb-4">
          <label for="title" class="block text-sm">
            Urutkan Berdasarkan
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
            Urutkan dari
          </label>
          <div class="mt-1">
            <select v-model="params.orderBy" name="approval_status" required class="form-input">
              <option v-for="item in optionsOrderByIdn" :key="item.key" :value="item.key">
                {{ item.value }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #buttons>
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="clearSortby"
        >
          Bersihkan
        </button>
        <button
          type="button"
          :class="checkSortIsEmpty ? 'btn-disable' : 'btn-primary'"
          :disabled="checkSortIsEmpty"
          @click="onSorting"
        >
          Terapkan
        </button>
      </template>
    </BaseModal>

    <!-- modal detail reservasi  -->
    <BaseModal modal-name="detail" modal-title="Detail Reservasi">
      <template #body>
        <div v-if="isAdmin" class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Nama
          </div>
          <div class="md:col-span-3">
            {{ detailData.user_fullname || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Judul Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.title || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Ruangan/Aset
          </div>
          <div class="md:col-span-3">
            {{ detailData.asset_name || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Tanggal dan Waktu Kegiatan
          </div>
          <div class="md:col-span-3">
            <div>{{ detailData.date && detailData.start_time && detailData.end_time ? getDisplayDateTimeManually(detailData.date, detailData.start_time, detailData.end_time) : '-' }}</div>
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Email Penanggung Jawab
          </div>
          <div class="md:col-span-3">
            {{ detailData.holder || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Catatan/Deskripsi Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.description || '-' }}
          </div>
        </div>
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Status
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_status ? findStatus(detailData.approval_status) : '-' }}
          </div>
        </div>
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Catatan Admin FO
          </div>
          <div class="md:col-span-3">
            {{ detailData.note || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Tanggal Reservasi Dibuat
          </div>
          <div class="md:col-span-3">
            {{ detailData.created_at ? getDisplayDateTime(detailData.created_at) : '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
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
      </template>
      <template #buttons>
        <button
          type="button"
          class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="closeModalDetail"
        >
          Tutup
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import Pagination from '~/components/Pagination.vue'
import { statusReservation, optionsSortBy, optionsOrderByIdn } from '~/assets/constant/enum'
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
        'Tanggal dan Waktu Kegiatan',
        'Catatan/Deskripsi Kegiatan',
        'Tanggal Reservasi Dibuat',
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
      optionsOrderByIdn,
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
      loading: false,
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
    sortResources (resources) {
      const sortedResource = resources.sort((a, b) =>
        b.resource_type.localeCompare(a.resource_type) || a.name.localeCompare(b.name)
      )
      return sortedResource
    },
    async getAssetList () {
      try {
        this.loading = true
        const response = await this.$axios.get('/asset/list')
        this.dataAsset = response ? this.sortResources(response.data.data) : []
        this.loading = false
      } catch (e) {
        this.errors = e
        this.loading = false
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
        confirmButtonText: '<i class="bx bx-sm bx-check" aria-hidden="true" /> OK',
        cancelButtonText: '<i class="bx bx-sm bx-close" aria-hidden="true" /> Cancel',
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
        confirmButtonText: '<i class="bx bx-sm bx-check" aria-hidden="true" /> OK',
        cancelButtonText: '<i class="bx bx-sm bx-close" aria-hidden="true" /> Cancel',
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

.div-spinner {
  @apply grid justify-items-center;
}

.spinner {
  @apply w-5 h-5 rounded-full border-2 border-transparent animate-spin;
  border-top-color: #219653;
  border-right-color: #219653;
}
</style>
