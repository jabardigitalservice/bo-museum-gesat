<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <Title id="list-reservasi">
        List Reservasi
      </Title>
      <Statistik />
      <!-- filter and add button -->
      <div class="w-full my-3">
        <div class="w-full grid grid-cols-1 gap-y-2 lg:grid-cols-2 gap-x-2">
          <div class="w-full">
            <jds-search
              v-model="params.search"
              icon
              :button="false"
              placeholder="Cari Judul Kegiatan"
              @submit="onSearch"
            />
          </div>
          <div class="w-full">
            <div class="w-full flex flex-wrap justify-between xl:justify-start gap-x-2">
              <div>
                <BaseButton @click="showModalFilter">
                  <template #icon>
                    <div class="btn">
                      <span class="pr-4">
                        Filter
                      </span>
                      <jds-icon size="sm" name="filter-outline" />
                    </div>
                  </template>
                </BaseButton>
              </div>
              <div>
                <BaseButton @click="showModalSort">
                  <template #icon>
                    <div class="btn">
                      <span class="pr-4">
                        Urutkan
                      </span>
                      <jds-icon size="sm" name="sort-alphabet-asc" />
                    </div>
                  </template>
                </BaseButton>
              </div>
              <div>
                <BaseButton :variant="isHasParams ? 'danger' : 'secondary'" @click="initParams">
                  <template #icon>
                    <div class="btn">
                      <span :class="isHasParams ? 'text-white' : 'text-green-700' ">
                        Reset
                      </span>
                    </div>
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="overflow-x-auto">
        <jds-data-table
          :headers="dataHeader"
          :items="dataReservasi"
          :pagination="dataPagination"
          :loading="loading"
          @next-page="nextPage"
          @previous-page="previousPage"
          @page-change="pageChange"
          @per-page-change="perPageChange"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.date="{item}">
            <p>{{ momentFormatDateId(item.date) }}</p>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.start_time="{item}">
            <p>{{ momentFormatTime(item.start_time) }}</p>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.end_time="{item}">
            <p>{{ momentFormatTime(item.end_time) }}</p>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.created_at="{item}">
            <p>{{ momentFormatTimeToTz(item.created_at) }}</p>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.action="{item}">
            <em
              class="bx bx-info-circle bx-sm cursor-pointer text-blue-400"
              title="Klik untuk melihat detail reservasi"
              @click="showModalDetail(item)"
            />
            <em
              v-if="!isAdmin && item.approval_status === 'NOT_YET_APPROVED'"
              class="bx bx-trash bx-sm cursor-pointer text-red-700"
              title="Klik untuk menghapus reservasi"
              @click="deleteData(item.id)"
            />
            <em
              v-if="isAdmin && item.approval_status === 'NOT_YET_APPROVED'"
              class="bx bx-calendar-check bx-sm cursor-pointer text-green-700"
              title="Setujui reservasi"
              @click="verifikasiData('approve', item.id)"
            />
            <em
              v-if="isAdmin && item.approval_status === 'NOT_YET_APPROVED'"
              class="bx bx-calendar-x bx-sm cursor-pointer text-red-700"
              title="Tolak reservasi"
              @click="verifikasiData('reject', item.id)"
            />
          </template>
        </jds-data-table>
      </div>
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
          <jds-select
            v-model="params.approval_status"
            name="approval_status"
            :options="statusReservation"
            options-header="Urutan"
            label="Ruangan/Aset"
            placeholder="Pilih Ruangan/Aset"
          />
        </div>
        <div v-if="isAdmin">
          <jds-select
            v-model="params.asset_id"
            name="asset_id"
            :options="dataAsset"
            options-header="Urutan"
            label="Ruangan/Aset"
            placeholder="Pilih Ruangan/Aset"
          />
        </div>
      </template>
      <template #buttons>
        <BaseButton
          type="button"
          variant="danger"
          label="Bersihkan"
          class="w-full py-2 px-4 shadow-sm text-sm font-medium"
          @click="clearFilter"
        />
        <BaseButton
          type="button"
          label="Terapkan"
          :variant="checkformIsEmpty ? 'secondary' : 'primary'"
          class="w-full py-2 px-4 shadow-sm text-sm font-medium"
          :disabled="checkformIsEmpty"
          @click="onFilter"
        />
      </template>
    </BaseModal>

    <!-- modal sort -->
    <BaseModal
      modal-name="sort"
      modal-title="Urutkan Data Reservasi"
    >
      <template #body>
        <div class="reservation__filter">
          <div class="mb-4">
            <jds-select
              v-model="params.sortBy"
              name="approval_status"
              :options="optionsSortBy"
              options-header="Urutan"
              label="Urutan Berdasarkan"
              placeholder="Pilih urutan"
            />
          </div>
          <div>
            <jds-select
              v-model="params.orderBy"
              name="approval_status"
              :options="optionsOrderByIdn"
              options-header="Urutan"
              label="Urutan dari"
              placeholder="Pilih urutan"
            />
          </div>
        </div>
      </template>
      <template #buttons>
        <BaseButton
          type="button"
          variant="danger"
          label="Bersihkan"
          class="w-full flex justify-center py-2 px-4"
          @click="clearSortby"
        />
        <BaseButton
          type="button"
          :variant="checkSortIsEmpty ? 'secondary' : 'primary'"
          label="Terapkan"
          :disabled="checkSortIsEmpty"
          class="w-full flex justify-center py-2 px-4"
          @click="onSorting"
        />
      </template>
    </BaseModal>

    <!-- modal detail reservasi  -->
    <BaseModal modal-name="detail" modal-title="Detail Reservasi">
      <template #body>
        <div v-if="isAdmin" class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Nama
          </div>
          <div class="md:col-span-3">
            {{ detailData.user_fullname || '-' }}
          </div>
        </div>
        <div class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Judul Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.title || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Ruangan/Aset
          </div>
          <div class="md:col-span-3">
            {{ detailData.asset_name || '-' }}
          </div>
        </div>
        <div class="md:(grid grid-cols-5)text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Tanggal dan Waktu Kegiatan
          </div>
          <div class="md:col-span-3">
            <div>{{ detailData.date && detailData.start_time && detailData.end_time ? getDisplayDateTimeManually(detailData.date, detailData.start_time, detailData.end_time) : '-' }}</div>
          </div>
        </div>
        <div class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Email Penanggung Jawab
          </div>
          <div class="md:col-span-3">
            {{ detailData.holder || '-' }}
          </div>
        </div>
        <div class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Catatan/Deskripsi Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.description || '-' }}
          </div>
        </div>
        <div v-if="false" class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Status
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_status ? findStatus(detailData.approval_status) : '-' }}
          </div>
        </div>
        <div v-if="false" class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Catatan Admin FO
          </div>
          <div class="md:col-span-3">
            {{ detailData.note || '-' }}
          </div>
        </div>
        <div class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Tanggal Reservasi Dibuat
          </div>
          <div class="md:col-span-3">
            {{ detailData.created_at ? getDisplayDateTime(detailData.created_at) : '-' }}
          </div>
        </div>
        <div class="md:(grid grid-cols-5) text-sm mb-4">
          <div class="md:col-span-2 text-blue-400">
            Tanggal Pembaruan
          </div>
          <div class="md:col-span-3">
            {{ detailData.updated_at ? getDisplayDateTime(detailData.updated_at) : '-' }}
          </div>
        </div>
        <div v-if="false" class="md:(grid grid-cols-5) text-sm">
          <div class="md:col-span-2 text-blue-400">
            Tanggal Verifikasi Admin
          </div>
          <div class="md:col-span-3">
            {{ detailData.approval_date ? getDisplayDateTime(detailData.approval_date) : '-' }}
          </div>
        </div>
      </template>
      <template #buttons>
        <jds-button
          type="button"
          variant="secondary"
          label="Tutup"
          class="w-full flex justify-center py-2 px-4 mt-6"
          @click="closeModalDetail"
        />
      </template>
    </BaseModal>
  </div>
</template>

<script>
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
  layout: 'admin',
  data () {
    return {
      errors: null,
      meta: {},
      dataUser: {},
      dataPagination: {
        currentPage: 1,
        itemsPerPage: 10,
        itemsPerPageOptions: [10, 50, 100],
        totalRows: 0
      },
      dataHeader: [
        {
          key: 'user_fullname',
          text: 'Nama'
        },
        {
          key: 'title',
          text: 'Judul Kegiatan'
        },
        {
          key: 'date',
          text: 'Tanggal Kegiatan'
        },
        {
          key: 'start_time',
          text: 'Waktu Mulai'
        },
        {
          key: 'end_time',
          text: 'Waktu Akhir'
        },
        {
          key: 'note',
          text: 'Catatan/Deskripsi Kegiatan Akhir'
        },
        {
          key: 'created_at',
          text: 'Tanggal Reservasi Dibuat'
        },
        {
          key: 'action',
          text: 'Aksi'
        }
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
        search: '',
        asset_id: null,
        approval_status: null,
        start_date: null,
        end_date: null,
        sortBy: '',
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
    nextPage (value) {
      this.params.page = value
      this.getDataReservation()
    },
    previousPage (value) {
      this.params.page = value
      this.getDataReservation()
    },
    pageChange (value) {
      this.params.page = value
      this.getDataReservation()
    },
    perPageChange (value) {
      this.params.perPage = value
    },
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
      this.params.search = ''
      this.params.asset_id = null
      this.params.approval_status = null
      this.params.start_date = null
      this.params.end_date = null
      this.params.sortBy = ''
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
        const dataAssetResource = response ? this.sortResources(response.data.data) : []
        for (const asset of dataAssetResource) {
          const dataAsset = {
            value: asset.id,
            label: asset.name
          }
          this.dataAsset.push(dataAsset)
        }
        this.loading = false
      } catch (e) {
        this.errors = e
        this.loading = false
      }
    },
    async getDataReservation () {
      try {
        this.loading = true
        const response = await this.$axios.get('/reservation', { params: this.params })
        this.dataReservasi = response ? response.data.data : []
        this.meta = response ? response.data.meta : {}
        this.dataPagination.totalRows = this.meta.total
      } catch (e) {
        this.errors = e
      } finally {
        this.loading = false
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
<style lang="postcss" scoped>
.btn-disable {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium text-white bg-gray-400;
}

.btn-disable:focus {
  @apply outline-none;
}

.btn-primary {
  @apply w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-green-700 text-white;
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
