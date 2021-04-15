<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <h1 class="text-4xl font-normal text-gray1">
        Dashboard
      </h1>
      <div>
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
        >
          <template v-slot:eventContent="arg" class="overflow-hidden">
            <b>{{ arg.timeText }}</b>
            <span class="block text-md font-medium">
              {{ `Kegiatan : ${arg.event.title}` }}
            </span>
            <span class="block">{{ `Nama : ${arg.event.extendedProps.name || ''}` }}</span>
            <span class="block">{{ `Resource : ${arg.event.extendedProps.resourceName || ''}` }}</span>
            <span class="block">{{ `Catatan : ${arg.event.extendedProps.catatan || ''}` }}</span>
          </template>
        </FullCalendar>
      </div>
    </div>
    <!-- Modal Add Reservation  -->
    <BaseModal modal-name="add" modal-title="Tambah Reservasi Baru">
      <template #body>
        <!-- Date and Time -->
        <section class="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label for="dateTime" class="block text-sm">
              Waktu dan Tanggal
              <span class="text-red">*</span>
            </label>
            <date-picker
              v-model="form.date"
              placeholder="Tanggal Akhir"
              class="form-input rounded-md"
              required
            />
          </div>

          <!-- Start Time -->
          <div>
            <label for="start-time" class="block text-sm">
              Dari
              <span class="text-red">*</span>
            </label>
            <select
              v-model="reservation.startTime"
              name="start-time"
              type="text"
              required
              class="w-full form-input bg-white rounded-md"
              @change="updateReservationEndTime"
            >
              <option v-for="time of reservation.timeInterval" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>

          <!-- End Time -->
          <div>
            <label for="end-time" class="block text-sm">
              Sampai
              <span class="text-red">*</span>
            </label>
            <select
              v-model="reservation.endTime"
              name="end-time"
              type="text"
              required
              class="w-full form-input bg-white rounded-md"
            >
              <option v-for="time of allowedReservationInterval" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
        </section>

        <!-- Repeat Booking -->
        <section class="grid grid-cols-3 gap-4 mb-6">
          <div class="col-span-1">
            <label for="repeat" class="block text-sm">
              Reservasi Berulang
              <span class="text-red">*</span>
            </label>
            <select v-model="form.repeat_type" name="repeat" class="w-full form-input bg-white rounded-md" @change="updateRepeatStatus">
              <option value="NONE">
                Tidak
              </option>
              <option value="DAILY">
                Perhari
              </option>
              <option value="WEEKLY">
                Perminggu
              </option>
              <option value="MONTHLY">
                Perbulan
              </option>
            </select>
          </div>
          <div class="col-span-2">
            <!-- Insert Dynamic Component Here -->
          </div>
        </section>

        <!-- Spaces -->
        <section class="mb-4">
          <label for="spaces" class="block text-sm">
            Ruangan/Aset
            <span class="text-red">*</span>
          </label>

          <!-- Multiple Select Dropdown -->
          <section>
            <div v-show="reservation.expand" class="absolute inset-0 w-full h-full" @click="closeOptions" />
            <!-- Select Dropdown -->
            <div class="relative">
              <button class="w-full form-input bg-white rounded-md cursor-pointer" @click="showOptions">
                <div class="flex justify-between ">
                  <p v-if="form.asset_ids.length">
                    <span class="text-sm text-gray3">{{ `(${form.asset_ids.length}) ` }}</span>
                    {{ form.asset_ids }}
                  </p>
                  <p v-else>
                    -- Pilih Ruangan --
                  </p>
                  <em class="bx bxs-chevron-down" />
                </div>
              </button>

              <!-- Select Options -->
              <div
                v-show="reservation.expand"
                class="flex flex-col shadow-lg border-2 border-gray3 p-2 overflow-auto bg-white h-56"
              >
                <label
                  v-for="resource of reservation.resourcesLists"
                  :key="resource.id"
                  class="cursor-pointer p-1 hover:bg-blue"
                >
                  <input
                    v-model="form.asset_ids"
                    type="checkbox"
                    :value="resource.id"
                    :checked="checkedResources(resource.id)"
                  >
                  {{ resource.name }}
                </label>
              </div>
            </div>
          </section>
        </section>

        <!-- Booking Name -->
        <section class="mb-4">
          <label for="name" class="block text-sm">
            Nama Kegiatan
            <span class="text-red">*</span>
          </label>
          <input v-model="form.title" name="name" type="text" class="w-full form-input bg-white rounded-md" required>
        </section>

        <!-- Holder Mail -->
        <section class="mb-4">
          <label for="holder-email" class="block text-sm">Tambahkan Email Penanggung Jawab</label>
          <input v-model="form.holder" name="holder-email" type="email" class="w-full form-input bg-white rounded-md">
        </section>

        <!-- Notes/Description -->
        <section>
          <label for="description" class="block text-sm">Catatan/Deskripsi Kegiatan</label>
          <textarea v-model="form.description" name="description" class="w-full form-input bg-white rounded-md" />
        </section>
      </template>

      <!-- Form Buttons -->
      <template #buttons>
        <Button btn-type="close" @btn-click="closeFormReservation" />
        <Button btn-type="submit" :disabled="formIsEmpty" @btn-click="addReservation" />
      </template>
    </BaseModal>
    <modal name="detail" :adaptive="true" :height="`auto`">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          DETAIL RESERVASI
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Nama Pegawai
          </div>
          <div class="md:col-span-3">
            {{ detailData.extendedProps.name || '-' }}
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
            {{ detailData.extendedProps.resourceName || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Waktu Reservasi
          </div>
          <div class="md:col-span-3">
            <div>{{ detailData.start && detailData.end ? getDisplayDateTimeManually(detailData.start, detailData.startStr, detailData.endStr) : '-' }}</div>
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Catatan Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.extendedProps.catatan || '-' }}
          </div>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="w-1/2 flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-red text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="deleteData"
          >
            Delete
          </button>
          <button
            type="button"
            class="w-1/2 flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
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
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGridPlugin from '@fullcalendar/scrollgrid'
import { toMoment } from '@fullcalendar/moment'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'
import { momentFormatDateId, momentFormatTimeISO } from '~/utils'
import { timeInterval } from '~/assets/constant/enum'

export default {
  layout: 'admin',
  components: {
    FullCalendar
  },
  data () {
    return {
      form: {
        title: null,
        asset_id: null,
        asset_ids: [],
        description: null,
        date: null,
        start_time: null,
        end_time: null,
        repeat_type: 'NONE',
        repeat: false
      },
      reservation: {
        startTime: null,
        endTime: null,
        timeInterval,
        expand: false,
        resourcesLists: null
      },
      calendarOptions: {
        locales: allLocales,
        locale: 'id',
        timeZone: 'local',
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimeGridPlugin,
          listPlugin,
          scrollGridPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimeGridDay,dayGridMonth,listWeek'
        },
        dayMinWidth: 180,
        height: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimeGridDay',
        resourceOrder: '-resource_type,title',
        resourceLabelContent: this.renderHeaderResource,
        resources: this.getResources,
        initialEvents: [],
        events: this.getReservations,
        nowIndicator: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventOverlap: this.handleEventOverlap,
        selectOverlap: this.handleSelectOverlap,
        eventAllow: this.handleEventAllow,
        eventChange: this.handleUpdate
      },
      calendarApi: null,
      detailData: {
        extendedProps: {}
      },
      clickInfo: {}
    }
  },
  computed: {
    allowedReservationInterval () {
      const { timeInterval, startTime } = this.reservation
      const startTimeIndex = timeInterval.indexOf(startTime)
      const maxLength = timeInterval.length
      return timeInterval.slice(startTimeIndex + 1, maxLength)
    },
    formIsEmpty () {
      const isFormEmpty = [
        this.form.title
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isFormEmpty
    }
  },
  methods: {
    updateRepeatStatus () {
      if (this.repeat_type !== 'NONE') {
        this.form.repeat = true
        return
      }
      this.form.repeat = true
    },
    checkedResources (id) {
      return this.form.asset_ids.indexOf(id)
    },
    showOptions (event) {
      this.reservation.expand = !this.reservation.expand
    },
    closeOptions (event) {
      this.reservation.expand = false
    },
    updateReservationEndTime () {
      const { timeInterval, startTime, endTime } = this.reservation
      const startTimeIndex = timeInterval.indexOf(startTime)
      const endTimeIndex = timeInterval.indexOf(endTime)
      if (startTimeIndex >= endTimeIndex) {
        this.reservation.endTime = timeInterval[startTimeIndex + 1]
      }
    },
    renderHeaderResource (arg) {
      return {
        html: `
          ${arg.resource.title}
          <span class="block text-sm text-blue">Kapasitas : ${arg.resource.extendedProps.capacity}</span>
      `
      }
    },
    getDisplayDateTimeManually (date, startTime, endTime) {
      if (date && startTime && endTime) {
        const dateString = momentFormatDateId(date)
        const startTimeString = momentFormatTimeISO(startTime)
        const endTimeString = momentFormatTimeISO(endTime)
        return `${dateString}, pukul ${startTimeString}-${endTimeString}`
      }
      return '-'
    },
    handleUpdate () {
      const calendarApi = this.$refs.fullCalendar.getApi()
      this.$toast.info('Sedang diproses', {
        iconPack: 'fontawesome',
        duration: 5000
      })
      this.$axios.put(`/reservation/${this.form.id}`, this.form).then((res) => {
        this.$toast.success('Berhasil diubah.', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        calendarApi.refetchEvents()
      }).catch((e) => {
        if (e.response.data?.code === 403) {
          this.$toast.error('Anda tidak ada akses untuk mengubah data ini.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
          calendarApi.refetchEvents()
        }
      })
    },
    addReservation () {
      const calendarApi = this.$refs.fullCalendar.getApi()
      this.$toast.info('Sedang memproses', {
        iconPack: 'fontawesome',
        duration: 5000
      })
      this.$modal.hide('add')
      this.$axios.post('/reservation', this.form).then(() => {
        this.$toast.success('Reservasi berhasil dibuat', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        calendarApi.refetchEvents()
      }).catch((e) => {
        if (e.response.data?.code === 403) {
          this.$toast.error('Anda tidak ada akses untuk menambah data ini.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        } else {
          this.$toast.error('Terjadi Kesalahan', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      })
    },
    closeFormReservation () {
      this.clearFormReservation()
      this.$modal.hide('add')
    },
    clearFormReservation () {
      this.form.title = null
      this.form.description = null
    },
    handleEventAllow (dropInfo, draggedEvent) {
      const now = new Date()
      now.setMinutes(now.getMinutes() + 30)
      if (toMoment(new Date(), draggedEvent._context.calendarApi).format() > dropInfo.startStr) {
        this.$toast.error('Tidak dapat melakukan reservasi sebelum waktu sekarang', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        return false
      } else if (toMoment(now, draggedEvent._context.calendarApi).format() > draggedEvent.startStr) {
        this.$toast.error('Dalam waktu 30 menit sebelum reservasi berlangsung anda tidak dapat mengubah reservasi', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        return false
      } else {
        this.form.id = draggedEvent.id
        this.form.title = draggedEvent.title
        this.form.description = draggedEvent.extendedProps.catatan
        this.form.asset_id = dropInfo.resource.id
        this.form.start_time = toMoment(dropInfo.start, draggedEvent._context.calendarApi).format('YYYY-MM-DD HH:mm')
        this.form.end_time = toMoment(dropInfo.end, draggedEvent._context.calendarApi).format('YYYY-MM-DD HH:mm')
        this.form.date = toMoment(dropInfo.start, draggedEvent._context.calendarApi).format('YYYY-MM-DD')
        return true
      }
    },
    handleSelectOverlap (event) {
      return event.rendering === 'background'
    },
    handleEventOverlap (stillEvent, movingEvent) {
      return stillEvent.allDay && movingEvent.allDay
    },
    getReservations (fetchInfo, successCallback, failureCallback) {
      this.$axios.get('/reservation/list').then((response) => {
        const reservations = response.data.data
        const reservationsMap = reservations.map((reservation) => {
          const newObj = {}
          newObj.id = reservation.id
          newObj.title = reservation.title
          newObj.start = reservation.start_time.slice(0, -8)
          newObj.end = reservation.end_time.slice(0, -8)
          newObj.resourceId = reservation.asset_id
          newObj.extendedProps = {
            name: reservation.user_fullname,
            resourceName: reservation.asset_name,
            catatan: reservation.description
          }
          return newObj
        })
        successCallback(reservationsMap)
      }).catch((e) => {
        failureCallback(e)
      })
    },
    getResources (fetchInfo, successCallback, failureCallback) {
      this.$axios.get('/asset/list').then((res) => {
        const resources = res.data.data
        const resourcesMap = resources.map((resource) => {
          const newObj = {}
          newObj.id = resource.id
          newObj.title = resource.name
          newObj.resource_type = resource.resource_type
          newObj.capacity = resource.capacity
          newObj.eventBackgroundColor = '#219653'
          return newObj
        })
        this.reservation.resourcesLists = resources ?? []
        successCallback(resourcesMap)
      }).catch((e) => {
        failureCallback(e)
      })
    },
    handleDateSelect (selectInfo) {
      const calendarApi = selectInfo.view.calendar
      if (toMoment(new Date(), selectInfo.view.calendar).format() < selectInfo.startStr) {
        this.$modal.show('add')
        this.clearFormReservation()
        this.reservation.startTime = toMoment(selectInfo.start, selectInfo.view.calendar).format('HH:mm')
        this.reservation.endTime = toMoment(selectInfo.end, selectInfo.view.calendar).format('HH:mm')
        this.form.asset_id = selectInfo.resource.id
        this.form.asset_ids = [selectInfo.resource.id]
        this.form.start_time = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.end_time = toMoment(selectInfo.end, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.date = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD')
        calendarApi.unselect()
      } else {
        this.$toast.error('Tidak dapat menambahkan reservasi sebelum waktu saat ini!', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        calendarApi.unselect()
      }
    },
    deleteData () {
      const calendarApi = this.$refs.fullCalendar.getApi()
      this.$swal.fire({
        title: 'Anda yakin menghapus data ini?',
        showCancelButton: true,
        type: 'warning',
        dangerMode: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          this.$axios.delete(`/reservation/${this.detailData.id}`).then(() => {
            this.$toast.success('Berhasil dihapus.', {
              iconPack: 'fontawesome',
              duration: 5000
            })
            calendarApi.refetchEvents()
          }).catch((e) => {
            if (e.response.data?.code === 403) {
              this.$toast.error('Anda tidak ada akses untuk menghapus data ini.', {
                iconPack: 'fontawesome',
                duration: 5000
              })
            }
          })
          this.$modal.hide('detail')
        }
      })
    },
    closeModalDetail () {
      this.$modal.hide('detail')
    },
    handleEventClick (clickInfo) {
      this.detailData = clickInfo.event
      this.$modal.show('detail')
    }
  }
}
</script>
<style>
@media (max-width: 768px){
  .fc .fc-header-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
  }
}
.fc-daygrid-day-frame.fc-scrollgrid-sync-inner {
  overflow-x: auto;
}
</style>
