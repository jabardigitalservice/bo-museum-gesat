<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- TITLE -->
      <h1 class="text-4xl font-normal text-gray1">
        List Reservasi
      </h1>
      <!-- FILTER -->
      <div class="w-full flex my-3">
        <div class="w-full flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 gap-2">
            <button class="btn bg-blue px-2" @click="showSearchModal">
              <i class="text-white bx bx-search bx-sm cursor-pointer" />
              <span>Search</span>
            </button>
            <button class="btn bg-blue px-2" @click="showModalFilter">
              <i class="bx bx-filter bx-sm" />
              <span>Filter</span>
            </button>
            <button class="btn bg-yellow px-2" @click="showModalSort">
              <i class="bx bx-sort-up bx-sm" />
              <span>Urutkan</span>
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
        <table class="w-full">
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
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white whitespace-no-wrap"
                  :class="reservation.approval_status === 'NOT_YET_APPROVED' ? 'bg-yellow' : reservation.approval_status === 'ALREADY_APPROVED' ? 'bg-primary' : 'bg-red'"
                >
                  {{ findStatus(reservation.approval_status) }}
                </span>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ getDisplayDateTime(reservation.reservation_date, false) }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap"
              >
                <div class="flex gap-2">
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
                </div>
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
    <BaseModal
      modal-name="filter"
      modal-title="Filter Data Reservasi"
    >
      <template #body>
        <div class="mb-4">
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
        <div class="mb-4">
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
      </template>
      <template #buttons>
        <ModalButton
          btn-type="clear"
          @btn-click="clearFilter"
        />
        <ModalButton
          btn-type="set"
          @btn-click="onFilter"
        />
      </template>
    </BaseModal>
    <!-- SORT MODAL -->
    <BaseModal
      modal-name="sort"
      modal-title="Urutkan Data Reservasi Command Center"
    >
      <template #body>
        <div class="mb-4">
          <label for="title" class="block text-sm">
            Urutkan Berdasarkan
          </label>
          <div class="mt-1">
            <select
              v-model="params.sortBy"
              name="approval_status"
              required
              class="
              w-full
              form-input
              bg-white
              rounded-md"
            >
              <option value="created_at">
                Created Date
              </option>
              <option value="reservation_date">
                Reservation Date
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm">
            Urutkan Dari
          </label>
          <div class="mt-1">
            <select
              v-model="params.orderDirection"
              name="approval_status"
              required
              class="w-full form-input bg-white rounded-md"
            >
              <option value="desc">
                Terbaru
              </option>
              <option value="asc">
                Terlama
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #buttons>
        <ModalButton
          btn-type="clear"
          @btn-click="clearSortby"
        />
        <ModalButton
          btn-type="set"
          :disabled="!params.sortBy || !params.orderDirection"
          @btn-click="onSorting"
        >
          Terapkan
        </ModalButton>
      </template>
    </BaseModal>
    <!-- DETAIL RESERVATION -->
    <BaseModal
      modal-name="detail"
      modal-title="Detail Reservasi"
      overflow
    >
      <template #body>
        <div class="grid sm:grid-cols-1 md:grid-cols-3 md:grid-rows-4 md:col-gap-6 row-gap-4">
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Nama Penanggung Jawab
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.name }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              NIK
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.nik }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Asal Instansi
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.organization_name || '-' }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Alamat
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.address || '-' }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Nomor Telepon Penanggung Jawab
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.phone_number }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Alamat Email
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.email }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Maksud dan Tujuan Kunjungan
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.purpose || '-' }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Jumlah Peserta
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.visitors }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Shift Kunjungan
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.command_center_shift || '-' }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Tanggal Kunjungan
            </div>
            <div class="font-medium text-blue">
              {{ getDisplayDateTime(reservationDetail.reservation_date, false) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Tanggal Reservasi Dibuat
            </div>
            <div class="font-medium text-blue">
              {{ getDisplayDateTime(reservationDetail.created_at) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Tanggal Pembaruan
            </div>
            <div class="font-medium text-blue">
              {{ getDisplayDateTime(reservationDetail.updated_at) }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-sm text-gray2">
              Tanggal Verifikasi Admin
            </div>
            <div class="font-medium text-blue">
              {{ reservationDetail.approval_date ? getDisplayDateTime(reservationDetail.approval_date) : '-' }}
            </div>
          </div>
        </div>
      </template>
      <template #buttons>
        <ModalButton
          btn-type="close"
          @btn-click="closeModalDetail"
        />
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { statusReservation } from '~/assets/constant/enum'
import { generateTimes, momentFormatDate, momentFormatTimeToTz, momentFormatDateId, isAdmin as admin } from '~/utils'

export default {
  layout: 'admin',
  data () {
    return {
      errors: null,
      activeData: 1,
      meta: {},
      dataUser: {},
      headers: [
        'Kode Reservasi',
        'Nama PIC',
        'Nama Instansi',
        'Status',
        'Tanggal Kunjungan',
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
        approval_status: null,
        orderDirection: null,
        sortBy: null
      },
      isHasParams: false,
      generateTimes,
      loading: false,
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
      this.params.sortBy = null
      this.params.orderDirection = null
      this.isHasParams = false
      this.refreshTable()
    },
    async getDataReservation () {
      try {
        this.loading = true
        const response = await this.$axios.get('/command-center-reservation', { params: this.params })
        this.reservations = response ? response.data.data : []
        this.meta = response ? response.data.meta : {}
        this.loading = false
      } catch (e) {
        this.errors = e
        this.loading = false
      }
    },
    async refreshTable () {
      await this.getDataReservation()
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
    onSorting () {
      this.checkParams()
      this.$modal.hide('sort')
      this.refreshTable()
    },
    clearSortby () {
      this.params.sortBy = null
      this.params.orderDirection = null
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
    showModalSort () {
      this.$modal.show('sort')
    },
    showSearchModal (data) {
      this.$modal.show('search')
    },
    closeSearchModal () {
      this.$modal.hide('search')
    },
    async verifikasiData (approval, id) {
      const swal = this.$swal
      const response = await swal.fire({
        title: approval === 'approve' ? 'Setujui Reservasi?' : 'Tolak Reservasi?',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: approval === 'approve' ? 'success' : 'error',
        input: 'textarea',
        inputPlaceholder: 'Tuliskan catatan disini (optional)',
        reverseButtons: true
      })
      if (!response.dismiss) {
        try {
          await this.$axios.put(`/command-center-reservation/${id}/approval`, {
            approval_status: approval === 'approve' ? 'ALREADY_APPROVED' : 'REJECTED',
            note: response.value
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
    },
    findStatus (stat) {
      const findStats = statusReservation.find(el => el.key === stat)
      return findStats.value
    },
    getDisplayDateTime (date, withTime = true) {
      if (date && withTime) {
        const dateString = momentFormatTimeToTz(date)
        return `${dateString}`
      }

      if (date && !withTime) {
        const dateString = momentFormatDateId(date)
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
<style scoped>
.div-spinner {
  @apply grid justify-items-center;
}

.spinner {
  @apply w-5 h-5 rounded-full border-2 border-transparent animate-spin;
  border-top-color: #219653;
  border-right-color: #219653;
}
</style>
