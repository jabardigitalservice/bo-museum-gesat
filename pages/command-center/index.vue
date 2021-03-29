<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Command Center
      </h1>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-2/3 lg:w-1/2">
            <button v-if="isAdmin" class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" />
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
              <i class="bx bx-sort-up bx-sm" />
              <span>Urutkan</span>
            </button>
          </div>
          <div class="w-1/2 lg:w-1/4 my-1 lg:pl-1">
            <button class="btn bg-blue">
              <i class="bx bx-filter bx-sm" />
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
              <i class="text-gray4 bx bx-search bx-sm cursor-pointer" />
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
                <i title="Edit Tanggal" class="bx bx-calendar-edit bx-sm cursor-pointer" @click="editDate(data)" />
                <i title="Hapus Tanggal" class="bx bx-trash bx-sm cursor-pointer text-red" @click="deleteCloseDate(data)" />
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
      <Pagination :active-pagination="activeData" :length-data="meta.last_page" @update="changeActivePagination" />
      <!-- modal add close date -->
      <modal
        name="addCloseDate"
        :adaptive="true"
        :height="`auto`"
        :max-width="500"
        :min-width="320"
        styles="overflow: visible"
      >
        <div class="w-full h-full p-4">
          <div class="window-header mb-2">
            TAMBAH TANGGAL TUTUP
          </div>
          <div>
            <div class="mb-2">
              <label for="closeDate" class="block text-sm">Tanggal Tutup</label>
              <date-picker
                v-model="form.selectedDate"
                placeholder="Pilih Tanggal Tutup"
                class="form-input rounded-md"
                name="closeDate"
              />
            </div>
            <div class="mb-2">
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
            <div class="flex space-x-4">
              <button
                type="button"
                class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                @click="closeModalAdd"
              >
                Batal
              </button>
              <button
                class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                @click="verifiedData"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import Pagination from '~/components/Pagination.vue'
import { isAdmin as admin, momentFormatDateId, momentFormatDate } from '~/utils'
export default {
  components: {
    Pagination
  },
  layout: 'admin',
  data () {
    return {
      errors: null,
      dataHeader: ['Tanggal Tutup', 'Keterangan', 'Aksi'],
      dataDisabledDate: [],
      momentFormatDateId,
      activeData: 1,
      meta: {},
      params: {
        id: null,
        page: null
      },
      form: {
        selectedDate: null,
        notes: null
      },
      submitForm: 'store'
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
      this.getDisabledDateData()
    }
  },
  created () {
    this.getDisabledDateData()
  },
  methods: {
    async getDisabledDateData () {
      try {
        const res = await this.$axios.$get('/close-days', { params: this.params })
        this.dataDisabledDate = res.data ?? []
        this.meta = res.meta ?? {}
      } catch (error) {
        this.errors = error
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
        this.$toast.error('Gagal menambahkan data', {
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
        this.$toast.error('Gagal menambahkan data', {
          iconPack: 'fontawesome',
          duration: 5000
        })
      }
    },
    async deleteCloseDate ({ id }) {
      const confirmed = await this.$swal.fire({
        title: 'Hapus Data?',
        showCancelButton: true,
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
    changeActivePagination (val) {
      this.params.page = val
      this.activeData = val
      this.refreshTable()
    },
    async refreshTable () {
      await this.getDisabledDateData()
    },
    showModalAdd () {
      this.resetValue()
      this.$modal.show('addCloseDate')
    },
    closeModalAdd () {
      this.$modal.hide('addCloseDate')
    },
    editDate (data) {
      this.form.selectedDate = data.date
      this.form.notes = data.note
      this.params.id = data.id
      this.submitForm = 'edit'
      this.$modal.show('addCloseDate')
    },
    resetValue () {
      this.params.id = null
      this.form.selectedDate = null
      this.form.notes = null
      this.submitForm = 'store'
    }
  }
}
</script>
