<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- TITLE -->
      <h1 class="text-4xl font-normal text-gray1">
        Reservasi Command Center
      </h1>
      <!-- FILTER -->
      <div class="w-full flex my-3">
        <div class="w-full flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="grid grid-cols-3 gap-2">
            <button class="btn bg-blue px-2" @click="showSearchModal">
              <i class="text-white bx bx-search bx-sm cursor-pointer" />
              <span>Search</span>
            </button>
            <button class="btn bg-blue px-2" @click="showModalFilter">
              <i class="bx bx-filter bx-sm" />
              <span>Filter</span>
            </button>
            <button class="btn" :class="isHasParams ? 'bg-red border border-red' : 'bg-white border border-grayText'" @click="initParams">
              <span class="hover:text-black" :class="isHasParams ? 'text-white' : 'text-grayText'">
                Reset
              </span>
            </button>
          </div>
        </div>
      </div>
      <!-- TABLE -->
      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <table v-if="render" class="w-full">
          <thead class="bg-primary">
            <tr>
              <th v-for="header in headers" :key="header" scope="col" class="thead">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody v-if="reservations.length > 0" class="tbody">
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td style="min-width:256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ reservation.reservation_code }}
                </div>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ reservation.name }}
                </div>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ reservation.organization_name || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                  :class="reservation.approval_status === 'NOT_YET_APPROVED' ? 'bg-yellow' : reservation.approval_status === 'ALREADY_APPROVED' ? 'bg-primary' : 'bg-red'"
                >
                  {{ findStatus(reservation.approval_status) }}
                </span>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ getDisplayDateTime(reservation.reservation_date) }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2"
              >
                <i
                  class="bx bx-info-circle bx-sm cursor-pointer text-blue"
                  title="Klik untuk melihat detail reservasi"
                  @click="showModalDetail(reservation)"
                />
                <i
                  v-show="isAdmin && reservation.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-calendar-check bx-sm cursor-pointer text-primary"
                  title="Setujui reservasi"
                  @click="verifikasiData('approve', reservation.id)"
                />
                <i
                  v-show="isAdmin && reservation.approval_status === 'NOT_YET_APPROVED'"
                  class="bx bx-calendar-x bx-sm cursor-pointer text-red"
                  title="Tolak reservasi"
                  @click="verifikasiData('reject', reservation.id)"
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
      <!-- PAGINATION -->
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
    </div>
    <!-- SEARCH MODAL -->
    <Search
      :by="params.by"
      :keyword="params.keyword"
      @on-search="onSearch"
      @clear-search="clearSearch"
      @input-by="params.by = $event"
      @input-keyword="params.keyword = $event"
    />
    <!-- FILTER MODAL -->
    <modal
      name="filter"
      height="60%"
      :adaptive="true"
      styles="overflow: visible"
    >
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          FILTER DATA RESERVASI
        </div>
        <div>
          <label for="title" class="block text-sm">
            Rentang Tanggal
          </label>
          <div class="flex flex-col sm:flex-row gap-2 mt-1">
            <date-picker
              v-model="params.start_date"
              placeholder="Tanggal Awal"
              class="form-input rounded-md"
            />
            <date-picker
              v-model="params.end_date"
              placeholder="Tanggal Akhir"
              class="form-input rounded-md"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm">
            Status
          </label>
          <div class="mt-1">
            <select v-model="params.approval_status" name="approval_status" required class="form-input bg-white rounded-md">
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
    <!-- DETAIL RESERVATION -->
    <modal name="detail" :adaptive="true" :height="`auto`">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          DETAIL RESERVASI
        </div>
        <div v-show="isAdmin" class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Nama Penanggung Jawab
          </div>
          <div class="md:col-span-3">
            {{ reservationDetail.name }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tujuan Kunjungan
          </div>
          <div class="md:col-span-3">
            {{ reservationDetail.description || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Jumlah Peserta
          </div>
          <div class="md:col-span-3">
            {{ reservationDetail.visitors }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Shift Kunjungan
          </div>
          <div class="md:col-span-3">
            <div>{{ reservationDetail.command_center_shift }}</div>
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Kunjungan
          </div>
          <div class="md:col-span-3">
            <div>{{ reservationDetail.reservation_date }}</div>
          </div>
        </div>
        <div v-if="false" class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Status
          </div>
          <div class="md:col-span-3">
            {{ findStatus(reservationDetail.approval_status) }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Reservasi Dibuat
          </div>
          <div class="md:col-span-3">
            {{ getDisplayDateTime(reservationDetail.created_at) }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Pembaruan
          </div>
          <div class="md:col-span-3">
            {{ getDisplayDateTime(reservationDetail.updated_at) }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Tanggal Verifikasi Admin
          </div>
          <div class="md:col-span-3">
            {{ reservationDetail.approval_date ? getDisplayDateTime(reservationDetail.approval_date) : '-' }}
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
import { statusReservation } from '~/assets/constant/enum'
import { generateTimes, momentFormatDate, momentFormatTimeToTz, isAdmin as admin } from '~/utils'

export default {
  layout: 'admin',
  data () {
    return {
      errors: null,
      render: true,
      activeData: 1,
      meta: {},
      dataUser: {},
      headers: [
        'Kode Reservasi',
        'Nama PIC',
        'Nama Instansi',
        'Status',
        'Tanggal',
        'Aksi'
      ],
      reservations: [],
      reservationDetail: {},
      statusReservation,
      params: {
        page: null,
        perPage: null,
        by: null,
        keyword: null,
        start_date: null,
        end_date: null,
        approval_status: null
      },
      isHasParams: false,
      generateTimes,
      rangeTimes: [],
      admin
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
  },
  methods: {
    initParams () {
      this.params.page = null
      this.params.perPage = null
      this.params.by = null
      this.params.keyword = null
      this.params.start_date = null
      this.params.end_date = null
      this.params.approval_status = null
      this.isHasParams = false
      this.refreshTable()
    },
    async getDataReservation () {
      try {
        const response = await this.$axios.get('/command-center-reservation', { params: this.params })
        this.reservations = response ? response.data.data : []
        this.meta = response ? response.data.meta : {}
      } catch (e) {
        this.errors = e
      }
    },
    async refreshTable () {
      this.render = false
      this.getDataReservation()
      await this.$nextTick()
      this.render = true
    },
    changeActivePagination (val) {
      this.activeData = val
      this.params.page = val
      this.refreshTable()
    },
    showModalFilter () {
      this.$modal.show('filter')
    },
    onSearch () {
      this.checkParams()
      this.$modal.hide('search')
      this.params.page = null
      this.refreshTable()
    },
    clearSearch () {
      this.params.keyword = null
      this.params.by = null
      this.checkParams()
      this.refreshTable()
    },
    onFilter () {
      this.checkParams()
      if (this.params.start_date <= this.params.end_date) {
        this.$modal.hide('filter')
        this.params.page = null
        this.refreshTable()
      } else {
        this.$toast.error('Tanggal awal harus kurang dari atau sama dengan tanggal akhir', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    clearFilter () {
      this.params.approval_status = null
      this.params.start_date = null
      this.params.end_date = null
      this.checkParams()
      this.refreshTable()
    },
    showModalDetail (data) {
      this.reservationDetail = data
      this.$modal.show('detail')
    },
    closeModalDetail () {
      this.$modal.hide('detail')
    },
    showSearchModal (data) {
      this.$modal.show('search')
    },
    closeSearchModal () {
      this.$modal.hide('search')
    },
    async verifikasiData (approval, id) {
      const swal = this.$swal
      const toast = this.$toast
      const {
        value: confirmation
      } = await swal.fire({
        title: approval === 'approve' ? 'Setujui Reservasi?' : 'Tolak Reservasi?',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: approval === 'approve' ? 'success' : 'error',
        input: 'textarea',
        inputPlaceholder: 'Tuliskan catatan disini (optional)',
        reverseButtons: true
      })
      if (confirmation) {
        try {
          await this.$axios.put(`/command-center-reservation/${id}`, {
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
    findStatus (stat) {
      const findStats = statusReservation.find(el => el.key === stat)
      return findStats.value
    },
    getDisplayDateTime (date) {
      if (date) {
        const dateString = momentFormatTimeToTz(date)
        return `${dateString}`
      }
      return '-'
    },
    checkParams () {
      Object.values(this.params).find(element => element !== null) === undefined ? this.isHasParams = false : this.isHasParams = true
    }
  }
}
</script>
