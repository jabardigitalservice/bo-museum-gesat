<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <!-- title -->
      <h1 class="text-4xl font-normal text-gray1">
        Ruangan/Aset
      </h1>
      <!-- filter and add button -->
      <div class="w-full flex flex-wrap my-3 ">
        <div class="w-full lg:w-1/2 my-1">
          <div class="w-1/2 lg:w-1/4">
            <button class="btn bg-primary" @click="showModalAdd">
              <i class="bx bx-plus bx-sm" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
        <div class="w-full lg:w-1/2 flex flex-wrap-reverse lg:flex-wrap flex-row-reverse">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-2 w-full">
              <div class="w-full px-4 py-2 bg-white border-solid border border-gray4 rounded flex justify-between items-center">
                <input v-model="params.name" class="w-full focus:outline-none" type="text" placeholder="Cari" @keyup.enter="fetchResource">
                <i class="text-gray4 bx bx-search bx-sm cursor-pointer" @click="fetchResource" />
              </div>
            </div>
            <div class="md:col-span-3 w-full">
              <div class="md:grid md:grid-cols-3 flex item-center">
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-blue" @click="showModalFilter">
                    <i class="bx bx-filter bx-sm" />
                    <span>Filter</span>
                  </button>
                </div>
                <div class="md:col-span-1 ml-2">
                  <button class="btn bg-yellow" @click="showModalSort">
                    <i class="bx bx-sort-up bx-sm" />
                    <span>Urutkan</span>
                  </button>
                </div>
                <div class="md:col-span-1 ml-2">
                  <button class="btn" :class="isHasParams ? 'bg-red border border-red' : 'bg-white border border-grayText'" @click.stop="resetFilter">
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
              <th v-for="header in dataHeader" :key="header" scope="col" class="thead">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody v-if="dataResource.length > 0" class="tbody">
            <tr v-for="resource in dataResource" :key="resource.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <span> {{ resource.name }} </span>
              </td>
              <td style="max-width:250px" class="px-6 py-4 truncate">
                <span> {{ resource.description }} </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span> {{ resource.capacity }} </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{'bg-gray3': resource.resource_type === 'offline'}"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue text-white capitalize"
                >
                  {{ resource.resource_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{'bg-red': resource.status === 'not_active'}"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary text-white capitalize"
                >
                  {{ resource.status === 'active' ? 'aktif' : 'tidak aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black">
                <span> {{ momentFormatDateId(resource.created_at) }} </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <i class="bx bx-edit bx-sm cursor-pointer" @click="editResource(resource)" />
                <i class="bx bx-trash bx-sm cursor-pointer text-red" @click="deleteResouce(resource.id)" />
              </td>
            </tr>
          </tbody>
          <tbody v-else class="tbody">
            <tr>
              <td colspan="7" class="w-full p-4 text-center text-gray3">
                Data tidak tersedia
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :active-pagination="activeData" :length-data="metaResource.last_page" @update="changeActivePagination" />
    </div>
    <!-- modal filter -->
    <modal
      name="filter"
      :min-width="320"
      :max-width="500"
      width="80%"
      height="auto"
      :adaptive="true"
    >
      <div class="bg-gray5 w-full h-full p-3">
        <h2 class="font-medium">
          FILTER DATA RUANGAN/ASET
        </h2>
        <div class="flex flex-col">
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Status</label>
            <select v-model="params.status" name="status" class="focus:outline-none rounded p-3 appearance-none border-2 border-gray2">
              <option v-for="status in optionsStatusResource" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <button class="btn bg-yellow" @click.stop="resetFilterModal">
              Bersihkan
            </button>
            <button
              :class="checkFilterIsEmpty ? 'btn-disable border-2 rounded' : 'btn bg-primary'"
              :disabled="checkFilterIsEmpty"
              @click.stop="applyFilterAndSort"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- modal sortby -->
    <modal
      name="sort"
      :min-width="320"
      :max-width="500"
      width="80%"
      height="auto"
      :adaptive="true"
    >
      <div class="bg-gray5 w-full h-full p-3">
        <h2 class="font-medium">
          URUTKAN DATA RUANGAN/ASET
        </h2>
        <div class="flex flex-col">
          <div class="w-full flex flex-col">
            <label class="font-medium" for="sort">Urutkan Berdasarkan</label>
            <select v-model="params.sortBy" name="sort" class="focus:outline-none rounded p-3 appearance-none border-2 border-gray2">
              <option v-for="sort in optionsSortResource" :key="sort.value" :value="sort.value">
                {{ sort.label }}
              </option>
            </select>
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="order">Urutkan dari</label>
            <select v-model="params.orderBy" name="order" class="focus:outline-none rounded p-3 appearance-none border-2 border-gray2 capitalize">
              <option v-for="order in optionsOrderByIdn" :key="order.key" class="capitalize" :value="order.key">
                {{ order.value }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <button class="btn bg-yellow" @click.stop="resetFilterModal">
              Bersihkan
            </button>
            <button
              :class="checkSortIsEmpty ? 'btn-disable border-2 rounded' : 'btn bg-primary'"
              :disabled="checkSortIsEmpty"
              @click.stop="applyFilterAndSort"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- modal add / edit -->
    <modal
      name="add"
      :min-width="320"
      :max-width="500"
      width="80%"
      height="80%"
      :adaptive="true"
    >
      <div class="bg-gray5 w-full h-full p-3 overflow-auto">
        <h2 class="font-medium text-xl">
          {{ titleAdd }} RUANGAN/ASET
        </h2>
        <div class="flex flex-col">
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Nama</label>
            <input v-model="form.name" type="text" class="focus:outline-none p-3 rounded border-2 border-gray2">
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Deskripsi</label>
            <textarea v-model="form.description" class="focus:outline-none rounded p-3 border-2 border-gray2" cols="10" rows="10" />
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Status</label>
            <select v-model="form.status" name="status" class="focus:outline-none rounded p-3 appearance-none border-2 border-gray2">
              <option v-for="status in optionsStatusResource" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Kapasitas</label>
            <input v-model="form.capacity" type="number" class="focus:outline-none p-3 rounded border-2 border-gray2">
          </div>
          <div class="w-full flex flex-col mt-3">
            <label class="font-medium" for="status">Tipe</label>
            <select v-model="form.resource_type" name="status" class="capitalize focus:outline-none rounded p-3 appearance-none border-2 border-gray2">
              <option v-for="(type, index) in optionsResourceType" :key="index" class="capitalize" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-3">
            <button class="btn bg-yellow" @click.stop="closeAdd">
              Tutup
            </button>
            <button v-if="submitForm == 'store'" :class="{'bg-gray4': formIsEmpty}" class="btn bg-primary" :disabled="formIsEmpty" @click.stop="storeResource">
              Simpan
            </button>
            <button v-else :class="{'bg-gray4': formIsEmpty}" class="btn bg-primary" :disabled="formIsEmpty" @click.stop="updateResource">
              Perbarui
            </button>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Pagination from '~/components/Pagination.vue'
import { optionsStatusResource, optionsResourceType, optionsSortResource, optionsOrderByIdn, thResourceAsset } from '~/assets/constant/enum'
import {
  momentFormatDateId
} from '~/utils'
export default {
  components: { Pagination },
  middleware: ['auth', 'admin'],
  layout: 'admin',
  data () {
    return {
      activeData: 1,
      dataHeader: thResourceAsset,
      params: {
        sortBy: null,
        orderBy: null,
        name: null,
        page: null,
        status: null
      },
      form: {
        name: null,
        isHasParams: false,
        description: null,
        status: 'active',
        capacity: 0,
        resource_type: 'online'
      },
      momentFormatDateId,
      optionsStatusResource,
      optionsOrderByIdn,
      optionsSortResource,
      optionsResourceType,
      submitForm: 'store'
    }
  },
  computed: {
    ...mapState('resource', [
      'dataResource',
      'metaResource'
    ]),
    formIsEmpty () {
      const isFormEmpty = [
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
    checkParams () {
      // check if another params not null, if true: reset button still red / isHasparams = true
      Object.values(this.params).find(element => element !== null) === undefined ? this.isHasParams = false : this.isHasParams = true
    },
    initParams () {
      this.params.sortBy = null
      this.params.orderBy = null
      this.params.status = null
      this.params.name = null
      this.params.page = null
      this.isHasParams = false
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
            this.activeData = 1
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
        this.activeData = 1
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
        this.activeData = 1
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
      this.$axios.get('/asset', { params: this.params }).then((response) => {
        this.$store.commit('resource/SET_RESOURCE', response.data)
      })
      this.checkParams()
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
      this.params.status = null
      this.fetchResource()
      this.activeData = 1
    },
    applyFilterAndSort () {
      this.fetchResource()
      this.checkParams()
      this.activeData = 1
    },
    changeActivePagination (val) {
      this.activeData = val
      this.params.page = val
      this.fetchResource()
    },
    showModalFilter () {
      this.params.status = 'active'
      this.initParams()
      this.$modal.show('filter')
    },
    showModalSort () {
      this.initParams()
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
