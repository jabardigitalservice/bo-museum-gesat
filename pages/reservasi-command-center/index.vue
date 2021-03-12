<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- TITLE -->
      <h1 class="text-4xl font-normal text-gray1">
        Reservasi Command Center
      </h1>
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
                  :class="reservation.approval_status === 'not_yet_approved' ? 'bg-yellow' : reservation.approval_status === 'already_approved' ? 'bg-primary' : 'bg-red'"
                >
                  {{ findStatus(reservation.approval_status) }}
                </span>
              </td>
              <td style="min-width:200px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ reservation.reservation_date }}
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
            <div>{{ reservationDetail.shift }}</div>
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
import { momentFormatTimeToTz, isAdmin as admin } from '~/utils'

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
      params: {
        page: null,
        perPage: null
      },
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
    }
  },
  created () {
    this.refreshTable()
  },
  methods: {
    initParams () {
      this.params.page = null
      this.params.perPage = null
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
    showModalDetail (data) {
      this.reservationDetail = data
      this.$modal.show('detail')
    },
    closeModalDetail () {
      this.$modal.hide('detail')
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
    }
  }
}
</script>
