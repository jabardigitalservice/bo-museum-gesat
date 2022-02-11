<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <Title>
        Ruangan/Aset
      </Title>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3">
        <div class="w-full grid grid-cols-2 py-2">
          <div class="w-1/4">
            <BaseButton variant="primary" @click="showModalAdd">
              <template #icon>
                <div class="btn">
                  <span class="pr-4">
                    Tambah
                  </span>
                  <jds-icon size="sm" name="plus-bold" />
                </div>
              </template>
            </BaseButton>
          </div>
        </div>
        <div class="w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
            <div class="w-auto pb-2">
              <jds-search
                v-model="params.name"
                icon
                :button="false"
                placeholder="Cari Ruangan/Aset"
                @submit="onSearch"
              />
            </div>
            <div class="w-full">
              <div class="flex flex-wrap xl:justify-start gap-x-2">
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
                  <BaseButton :variant="hasParams ? 'danger' : 'secondary'" @click="initParams">
                    <template #icon>
                      <div class="btn">
                        <span :class="hasParams ? 'text-white' : 'text-green-700' ">
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
      </div>
      <!-- table -->
      <div class="align-middle inline-block min-w-full  overflow-x-auto">
        <jds-data-table
          :headers="dataHeader"
          :items="dataResource"
          :pagination="dataPagination"
          :loading="loading"
          @next-page="nextPage"
          @previous-page="previousPage"
          @page-change="pageChange"
          @per-page-change="perPageChange"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.resource_type="{item}">
            <BaseChips :value="item.resource_type === 'online' ? 'Online' : 'Offline'" :variant="item.resource_type === 'online' ? 'online' : 'offline'" />
            <!-- <p>{{ (item.resource_type === 'online' ? 'Online' : 'Offline') }}</p> -->
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.status="{item}">
            <BaseChips :value="item.status === 'active' ? 'Aktif' : 'Tidak Aktif'" :variant="item.status === 'active' ? 'active' : 'non-active'" />
            <!-- <p>{{ (item.status === 'active' ? 'Aktif' : 'Tidak Aktif') }}</p> -->
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.created_at="{item}">
            <p>{{ momentFormatDateId(item.created_at) }}</p>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.action="{item}">
            <em title="Edit Ruangan/Aset" class="bx bx-edit bx-sm cursor-pointer" @click="editResource(item)" />
            <em title="Hapus Ruangan/Aset" class="bx bx-trash bx-sm cursor-pointer text-red" @click="deleteResouce(item.id)" />
          </template>
        </jds-data-table>
      </div>
    </div>
    <!-- modal filter -->
    <BaseModal
      modal-name="filter"
      modal-title="Filter Data Ruangan/Aset"
    >
      <template #body>
        <div>
          <jds-select
            v-model="params.status"
            name="status"
            :options="optionsStatusResource"
            label="Status"
            placeholder="Pilih"
          />
        </div>
      </template>
      <template #buttons>
        <BaseButton
          label="Bersihkan"
          variant="danger"
          class="w-full"
          @click="resetFilterModal"
        />
        <BaseButton
          label="Terapkan"
          :variant="checkFilterIsEmpty ? 'secondary' : 'primary'"
          class="w-full"
          :disabled="checkFilterIsEmpty"
          @click="applyFilterAndSort"
        />
      </template>
    </BaseModal>

    <!-- modal sortby -->
    <BaseModal
      modal-name="sort"
      modal-title="Urutkan Data Ruangan/Aset"
    >
      <template #body>
        <div class="asset__sort w-full flex flex-col">
          <jds-select
            v-model="params.sortBy"
            name="sort"
            :options="optionsSortResource"
            label="Urutkan Berdasarkan"
            placeholder="Pilih"
          />
        </div>
        <div class="w-full flex flex-col mt-3">
          <jds-select
            v-model="params.orderBy"
            name="order"
            :options="optionsOrderByIdn"
            label="Urutkan dari"
            placeholder="Pilih"
          />
        </div>
      </template>
      <template #buttons>
        <BaseButton
          label="Bersihkan"
          variant="danger"
          class="w-full"
          @click="resetFilterModal"
        />
        <BaseButton
          label="Terapkan"
          :variant="checkSortIsEmpty ? 'secondary' :'primary'"
          class="w-full"
          :disabled="checkSortIsEmpty"
          @click="applyFilterAndSort"
        />
      </template>
    </BaseModal>

    <!-- modal add / edit -->
    <BaseModal
      modal-name="add"
      :modal-title="`${titleAdd} RUANGAN/ASET`"
      overflow
    >
      <template #body>
        <div class="mb-4">
          <jds-input-text
            v-model="form.name"
            class="w-full"
            name="assetName"
            label="Nama"
            placeholder="Nama Ruangan/Aset"
          />
        </div>
        <div class="asset__description mb-4">
          <jds-text-area
            v-model="form.description"
            class="w-full"
            name="description"
            label="Deskripsi"
            placeholder="Deskripsi"
          />
        </div>
        <div class="asset__description mb-4">
          <jds-select
            v-model="form.status"
            name="status"
            :options="optionsStatusResource"
            label="Status"
            placeholder="Pilih Status"
          />
        </div>
        <div class="w-full mb-4">
          <label class="block text-base text-gray-800 font-sans leading-normal" for="status">Kapasitas</label>
          <input
            v-model="form.capacity"
            name="capacity"
            type="number"
            class="w-full form-input bg-white rounded-lg border-gray-800 focus:outline-none focus:border-green-400"
            placeholder="Masukkan Angka"
            required
          >
        </div>
        <div class="mb-4">
          <jds-select
            v-model="form.resource_type"
            name="status"
            :options="optionsResourceType"
            label="Tipe"
            placeholder="Pilih Tipe"
          />
        </div>
      </template>
      <template #buttons>
        <BaseButton
          label="Tutup"
          variant="secondary"
          class="w-full"
          @click="closeAdd"
        />
        <BaseButton
          v-if="submitForm === 'store'"
          label="Simpan"
          :variant="formIsEmpty ? 'secondary' :'primary'"
          :disabled="formIsEmpty"
          type="submit"
          class="w-full"
          @click="storeResource"
        />
        <BaseButton
          v-else
          label="Perbarui"
          :variant="formIsEmpty ? 'secondary' :'primary'"
          :disabled="formIsEmpty"
          class="w-full"
          @click="updateResource"
        />
      </template>
    </BaseModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { optionsStatusResource, optionsResourceType, optionsSortResource, optionsOrderByIdn, thResourceAsset } from '~/assets/constant/enum'
import { momentFormatDateId } from '~/utils'
export default {
  middleware: ['auth', 'admin'],
  layout: 'admin',
  data () {
    return {
      dataHeader: thResourceAsset,
      meta: {},
      dataPagination: {
        currentPage: 1,
        itemsPerPage: 10,
        itemsPerPageOptions: [10, 20, 30, 40, 50],
        totalRows: 0
      },
      params: {
        sortBy: null,
        orderBy: null,
        name: '',
        page: null,
        perPage: null,
        status: null
      },
      form: {
        name: '',
        description: null,
        status: 'active',
        capacity: 0,
        resource_type: 'online'
      },
      hasParams: false,
      momentFormatDateId,
      optionsStatusResource,
      optionsOrderByIdn,
      optionsSortResource,
      optionsResourceType,
      submitForm: 'store',
      loading: false
    }
  },

  computed: {
    ...mapState('resource', [
      'dataResource',
      'metaResource'
    ]),
    formIsEmpty () {
      const isFormEmpty = [
        this.form.status,
        this.form.name,
        this.form.capacity,
        this.form.resource_type
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
    },
    checkFilterIsEmpty () {
      const isFormEmpty = [
        this.params.status
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
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
    },
    titleAdd () {
      return this.submitForm === 'store' ? 'TAMBAH' : 'PERBARUI'
    }
  },
  created () {
    this.fetchResource()
  },
  methods: {
    nextPage (value) {
      this.params.page = value
      this.fetchResource()
    },
    previousPage (value) {
      this.params.page = value
      this.fetchResource()
    },
    pageChange (value) {
      this.params.page = value
      this.fetchResource()
    },
    perPageChange (value) {
      this.params.perPage = value
    },
    onSearch () {
      this.checkParams()
      this.refreshTable()
    },
    checkParams () {
      // check if another params not null, if true: reset button still red / hasParams = true
      Object.values(this.params).find(element => element !== null) === undefined ? this.hasParams = false : this.hasParams = true
    },
    initParams () {
      this.params.sortBy = null
      this.params.orderBy = null
      this.params.status = null
      this.params.name = ''
      this.params.page = null
      this.params.perPage = null
      this.hasParams = false
      this.refreshTable()
    },
    async refreshTable () {
      await this.fetchResource()
    },
    initForm () {
      this.form.name = null
      this.form.description = null
      this.form.status = 'active'
      this.form.capacity = null
      this.form.resource_type = 'online'
    },
    closeAdd () {
      this.$modal.hide('add')
    },
    editResource (data) {
      this.form = { ...data }
      this.submitForm = 'update'
      this.$modal.show('add')
    },
    deleteResouce (id) {
      this.$swal.fire({
        title: 'Hapus Data?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Batal',
        type: 'warning',
        dangerMode: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          this.$axios.delete(`/asset/${id}`).then(() => {
            this.$toast.success('Berhasil dihapus.', {
              iconPack: 'fontawesome',
              duration: 5000
            })
            this.initParams()
            this.fetchResource()
          }).catch(() => {
            this.$toast.error('Terjadi Kesalahan', {
              iconPack: 'fontawesome',
              duration: 5000
            })
          })
        }
      })
    },
    updateResource () {
      this.$modal.hide('add')
      this.$axios.put(`/asset/${this.form?.id}`, this.form).then(() => {
        this.$toast.success('Berhasil diubah.', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        this.initParams()
        this.fetchResource()
      }).catch((e) => {
        const error = e.response.data
        if (error.errors && error.errors.name) {
          this.$toast.error(error.errors.name, {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      })
    },
    storeResource () {
      this.$modal.hide('add')
      this.$axios.post('/asset', this.form).then(() => {
        this.$toast.success('Berhasil ditambahkan.', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        this.initParams()
        this.fetchResource()
      }
      ).catch((e) => {
        const error = e.response.data
        if (error.errors && error.errors.name) {
          this.$toast.error(error.errors.name, {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      })
      this.initForm()
    },
    fetchResource () {
      this.$modal.hide('sort')
      this.$modal.hide('filter')
      this.loading = true
      this.$axios.get('/asset', { params: this.params }).then((response) => {
        this.$store.commit('resource/SET_RESOURCE', response.data)
        this.meta = response ? response.data.meta : {}
        this.dataPagination.totalRows = this.meta.total
        this.loading = false
      })
    },
    resetFilterModal () {
      this.initForm()
      this.initParams()
      this.params.status = null
    },
    resetFilter () {
      this.initForm()
      this.initParams()
      this.checkParams()
      this.fetchResource()
    },
    applyFilterAndSort () {
      this.fetchResource()
      this.checkParams()
    },
    showModalFilter () {
      this.$modal.show('filter')
    },
    showModalSort () {
      this.$modal.show('sort')
    },
    showModalAdd () {
      this.initForm()
      this.submitForm = 'store'
      this.$modal.show('add')
    }
  }
}
</script>
