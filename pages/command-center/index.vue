<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Pengaturan Waktu Tutup
      </h1>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-2/3 lg:w-1/2">
            <button v-if="isAdmin" class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" aria-hidden="true" />
              <span>Tambah Tanggal Tutup</span>
            </button>
          </div>
        </div>
        <div
          v-if="false"
          class="w-full lg:w-1/2 flex flex-wrap-reverse lg:flex-wrap flex-row-reverse"
        >
          <div class="w-1/2 lg:w-1/4 my-1 pl-1">
            <button class="btn bg-yellow">
              <i class="bx bx-sort-up bx-sm" aria-hidden="true" />
              <span>Urutkan</span>
            </button>
          </div>
          <div class="w-1/2 lg:w-1/4 my-1 lg:pl-1">
            <button class="btn bg-blue">
              <i class="bx bx-filter bx-sm" aria-hidden="true" />
              <span>Filter</span>
            </button>
          </div>
          <div class="w-full lg:w-1/2 my-1">
            <div
              class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center"
            >
              <input
                class="w-full focus:outline-none"
                type="text"
                placeholder="Search"
              >
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary">
            <tr>
              <th
                v-for="head in dataHeader"
                :key="head"
                scope="col"
                class="thead"
              >
                {{ head }}
              </th>
            </tr>
          </thead>
          <tbody v-if="dataDisabledDate.length > 0" class="tbody">
            <tr v-for="data in dataDisabledDate" :key="data.id">
              <td style="min-width: 256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ momentFormatDateId(data.date) }}
                </div>
              </td>
              <td style="min-width: 256px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ data.note }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <em title="Edit Tanggal" class="bx bx-edit bx-sm cursor-pointer" @click="editDate(data)" />
                <em title="Hapus Tanggal" class="bx bx-trash bx-sm cursor-pointer text-red" @click="deleteCloseDate(data)" />
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
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
      <!-- modal add close date -->
      <BaseModal
        modal-name="addCloseDate"
        :modal-title="`${titleAdd} TANGGAL TUTUP`"
      >
        <template #body>
          <div class="mb-4">
            <label for="closeDate" class="block text-sm">Tanggal Tutup</label>
            <date-picker
              v-model="form.selectedDate"
              placeholder="Pilih Tanggal Tutup"
              class="w-full form-input bg-white rounded-md"
              name="closeDate"
            />
          </div>
          <div>
            <label for="notes" class="block text-sm">Keterangan</label>
            <textarea
              v-model="form.notes"
              class="form-input rounded-md"
              name="notes"
              cols="15"
              rows="4"
              placeholder="Masukkan Alasan Tutup"
            />
          </div>
        </template>
        <template #buttons>
          <ModalButton
            btn-type="close"
            @btn-click="closeModalAdd"
          />
          <ModalButton
            btn-type="submit"
            @btn-click="verifiedData"
          />
        </template>
      </BaseModal>
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Pengaturan Waktu Kunjungan
      </h1>
      <!-- Filter, Add, List Shift -->
      <div class="w-full flex flex-wrap my-3">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-2/3 lg:w-1/2">
            <button v-if="isAdmin" class="btn bg-primary" @click="showModalAddShift">
              <i class="bx bx-plus bx-sm" aria-hidden="true" />
              <span>Tambah Shift</span>
            </button>
          </div>
        </div>
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full overflow-x-auto">
        <table class="w-full">
          <thead class="bg-primary">
            <tr>
              <th
                v-for="headShift in dataHeaderShift"
                :key="headShift"
                class="thead"
                scope="col"
              >
                {{ headShift }}
              </th>
            </tr>
          </thead>
          <tbody v-if="dataShift.length > 0" class="tbody">
            <tr v-for="shift in dataShift" :key="shift.id">
              <td style="max-width:250px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ shift.name }}
                </div>
              </td>
              <td style="max-width:250px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ shift.time }}
                </div>
              </td>
              <td style="max-width:250px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  {{ shift.capacity }} Orang
                </div>
              </td>
              <td style="max-width:250px" class="px-6 py-4 whitespace-nowrap">
                <div class="text-md">
                  <span
                    :class="{'bg-red': shift.status === 'NOT_ACTIVE'}"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary text-white capitalize"
                  >
                    {{ shift.status === 'ACTIVE' ? 'aktif' : 'tidak aktif' }}
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <em class="bx bx-edit bx-sm cursor-pointer" title="Ubah waktu kunjungan" @click="editShift(shift)" />
                <em class="bx bx-trash bx-sm cursor-pointer text-red" title="Hapus waktu kunjungan" @click="deleteShift(shift)" />
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
      <Pagination :active-pagination="activeDataShift" :length-data="metaShift.last_page" @update="changeActivePaginationShift" />
      <!-- modal add shift -->
      <BaseModal
        modal-name="addShift"
        :modal-title="`${ titleAdd } SHIFT`"
        overflow
      >
        <template #body>
          <div class="mb-4">
            <label for="nameShift" class="block text-sm">Nama</label>
            <input v-model="formShift.nameShift" class="w-full form-input bg-white rounded-md" type="text" placeholder="Nama Shift" name="nameShift">
          </div>
          <div class="mb-4">
            <label for="timeShift" class="block text-sm">Waktu Kunjungan</label>
            <div class="flex sm:flex-col md:flex-row gap-8">
              <select v-model="formShift.startShift" name="startShift" class="form-input bg-white rounded-md">
                <option v-for="times in generatedTimes" :key="times" :value="times">
                  {{ times }}
                </option>
              </select>
              <span> - </span>
              <select v-model="formShift.endShift" name="endShift" class="form-input bg-white rounded-md">
                <option v-for="times in generatedTimes" :key="times" :value="times">
                  {{ times }}
                </option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label for="quotaShift" class="block text-sm" min="1">Kapasitas</label>
            <input
              v-model="formShift.capacityShift"
              name="quotaShift"
              type="number"
              class="w-full form-input bg-white rounded-md"
              placeholder="Kapasitas Peserta Per Shift"
            >
          </div>
          <div>
            <label for="statusShift" class="block text-sm">Status</label>
            <select v-model="formShift.statusShift" name="statusShift" class="w-full form-input bg-white rounded-md">
              <option v-for="status in dataStatus" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
        </template>
        <template #buttons>
          <ModalButton
            btn-type="close"
            @btn-click="closeModalAddShift"
          />
          <ModalButton
            btn-type="submit"
            :disabled="formIsEmpty"
            @btn-click="verifiedDataShift"
          />
        </template>
      </BaseModal>
    </div>
  </div>
</template>

<script>
import Pagination from '~/components/Pagination.vue'
import { isAdmin as admin, momentFormatDateId, momentFormatDate, generateTimes } from '~/utils'
export default {
  components: {
    Pagination
  },
  layout: 'admin',
  data () {
    return {
      errors: null,
      dataHeader: ['Tanggal Tutup', 'Keterangan', 'Aksi'],
      dataHeaderShift: ['Nama Shift', 'Waktu Kunjungan', 'Kapasitas', 'Status', 'Aksi'],
      dataDisabledDate: [],
      dataShift: [],
      dataStatus: ['ACTIVE', 'NOT_ACTIVE'],
      momentFormatDateId,
      generatedTimes: [],
      activeData: 1,
      activeDataShift: 1,
      meta: {},
      metaShift: {},
      params: {
        id: null,
        page: null
      },
      form: {
        selectedDate: null,
        notes: null
      },
      formShift: {
        nameShift: null,
        startShift: null,
        endShift: null,
        capacityShift: null,
        statusShift: null
      },
      submitForm: 'store',
      loading: false,
      errorMessage: 'Gagal menambahkan data'
    }
  },
  computed: {
    isAdmin () {
      return admin(this.$auth)
    },
    formIsEmpty () {
      const valShift = this.formShift.capacityShift
      const isFormEmpty = [
        this.formShift.nameShift,
        this.formShift.startShift,
        this.formShift.endShift,
        this.formShift.statusShift
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })

      return (
        (!valShift || valShift <= 0 || /[^0-9]\d*$/.test(valShift)) || isFormEmpty
      )
    },
    titleAdd () {
      return this.submitForm === 'store' ? 'TAMBAH' : 'PERBARUI'
    }
  },
  watch: {
    activeData (val) {
      this.params.page = val
      this.getDisabledDateData()
    },
    activeDataShift (val) {
      this.params.page = val
      this.getDataShift()
    }
  },
  created () {
    this.getDisabledDateData()
    this.generatedTimes = generateTimes()
    this.getDataShift()
  },
  methods: {
    async getDataShift () {
      try {
        this.loading = true
        const res = await this.$axios.$get('/command-center-shift', { params: this.params })
        this.dataShift = res.data ?? []
        this.metaShift = res.meta ?? {}
        this.loading = false
      } catch (error) {
        this.errors = error
        this.loading = false
      }
    },
    async getDisabledDateData () {
      try {
        this.loading = true
        const res = await this.$axios.$get('/close-days', { params: this.params })
        this.dataDisabledDate = res.data ?? []
        this.meta = res.meta ?? {}
        this.loading = false
      } catch (error) {
        this.errors = error
        this.loading = false
      }
    },
    verifiedData () {
      const closeDate = this.form.selectedDate ? momentFormatDate(this.form.selectedDate) : null
      const notes = this.form.notes
      if (!closeDate) {
        return this.$toast.error('Tanggal Tutup tidak boleh kosong', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
      if (!notes) {
        return this.$toast.error('Keterangan tidak boleh kosong', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
      if (this.submitForm === 'store') {
        return this.submitCloseDate(closeDate, notes)
      }
      if (this.submitForm === 'edit') {
        return this.updateCloseDate(closeDate, notes, this.params.id)
      }
    },
    verifiedDataShift () {
      if (this.submitForm === 'store') {
        return this.storeShift()
      }
      if (this.submitForm === 'edit') {
        return this.editStoreShift(this.params.id)
      }
    },
    async submitCloseDate (closeDate, notes) {
      try {
        this.$modal.hide('addCloseDate')
        await this.$axios.post('/close-days', {
          date: closeDate,
          note: notes
        }).then(() => {
          this.$toast.success('Tanggal Tutup berhasil ditambahkan', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        })
        this.refreshTable()
        this.activeData = 1
      } catch (err) {
        if (err.response.status === 422) {
          return this.$toast.error('Maaf, tanggal yang dipilih telah diinput atau telah lewat!', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
        this.$toast.error(this.errorMessage, {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    async updateCloseDate (closeDate, notes, id) {
      try {
        await this.$axios.put(`/close-days/${id}`, {
          date: closeDate,
          note: notes
        }).then(() => {
          this.$toast.success('Tanggal Tutup berhasil diupdate', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        })
        this.closeModalAdd()
        this.refreshTable()
        this.activeData = 1
      } catch (err) {
        if (err.response.status === 422) {
          return this.$toast.error('Maaf, tanggal yang dipilih telah diinput atau telah lewat!', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
        this.$toast.error(this.errorMessage, {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    async deleteCloseDate ({ id }) {
      const confirmed = await this.$swal.fire({
        title: 'Hapus Data?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Batal',
        type: 'warning',
        dangerMode: true
      })
      if (confirmed.value) {
        try {
          await this.$axios.$delete(`/close-days/${id}`)
          this.$toast.success('Tanggal Berhasil dihapus.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
          this.refreshTable()
          this.activeData = 1
        } catch (error) {
          this.$toast.error('Gagal menghapus tanggal.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      }
    },
    async deleteShift ({ id }) {
      const confirmed = await this.$swal.fire({
        title: 'Hapus Data?',
        confirmButtonText: 'Ok',
        cancelButtonText: 'Batal',
        showCancelButton: true,
        type: 'warning',
        dangerMode: true
      })
      if (confirmed.value) {
        try {
          await this.$axios.$delete(`/command-center-shift/${id}`)
          this.$toast.success('Waktu Kunjungan Berhasil dihapus.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
          this.refreshTableShift()
          this.activeDataShift = 1
        } catch (error) {
          this.$toast.error('Gagal menghapus waktu kunjungan.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      }
    },
    changeActivePagination (val) {
      this.params.page = val
      this.activeData = val
      this.refreshTable()
    },
    changeActivePaginationShift (val) {
      this.params.page = val
      this.activeDataShift = val
      this.refreshTableShift()
    },
    async refreshTable () {
      await this.getDisabledDateData()
    },
    async refreshTableShift () {
      await this.getDataShift()
    },
    async editStoreShift (id) {
      try {
        this.$modal.hide('addShift')
        await this.$axios.put(`/command-center-shift/${id}`, {
          name: this.formShift.nameShift,
          time: `${this.formShift.startShift} - ${this.formShift.endShift}`,
          status: this.formShift.statusShift,
          capacity: this.formShift.capacityShift
        }).then(() => {
          this.$toast.success('Waktu Kunjungan berhasil diupdate', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        })
        this.refreshTableShift()
        this.resetValue()
      } catch (err) {
        this.$toast.error('Gagal merubah data', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    async storeShift () {
      try {
        this.$modal.hide('addShift')
        await this.$axios.post('/command-center-shift', {
          name: this.formShift.nameShift,
          time: `${this.formShift.startShift} - ${this.formShift.endShift}`,
          status: this.formShift.statusShift,
          capacity: this.formShift.capacityShift
        }).then(() => {
          this.$toast.success('Waktu Kunjungan berhasil ditambahkan', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        })
        this.refreshTableShift()
        this.resetValue()
      } catch (err) {
        this.$toast.error(this.errorMessage, {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    showModalAdd () {
      this.resetValue()
      this.$modal.show('addCloseDate')
    },
    showModalAddShift () {
      this.resetValue()
      this.$modal.show('addShift')
    },
    closeModalAdd () {
      this.$modal.hide('addCloseDate')
    },
    closeModalAddShift () {
      this.$modal.hide('addShift')
    },
    editDate (data) {
      this.form.selectedDate = data.date
      this.form.notes = data.note
      this.params.id = data.id
      this.submitForm = 'edit'
      this.$modal.show('addCloseDate')
    },
    editShift (data) {
      const timeShift = data.time.split(' - ')
      this.submitForm = 'edit'
      this.params.id = data.id
      this.formShift.startShift = timeShift[0]
      this.formShift.endShift = timeShift[1]
      this.formShift.nameShift = data.name
      this.formShift.capacityShift = data.capacity
      this.formShift.statusShift = data.status
      this.$modal.show('addShift')
    },
    resetValue () {
      this.params.id = null
      this.form.selectedDate = null
      this.formShift.nameShift = null
      this.formShift.startShift = null
      this.formShift.endShift = null
      this.formShift.capacityShift = null
      this.formShift.statusShift = null
      this.form.notes = null
      this.submitForm = 'store'
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
