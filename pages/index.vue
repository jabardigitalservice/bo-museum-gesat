<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <h1 class="text-4xl font-normal text-gray1">
        Kalender Reservasi
      </h1>
      <div>
        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
      </div>
    </div>
    <!-- Modal Add Reservation  -->
    <BaseModal
      modal-name="add"
      :modal-title="reservation.isEdit ? 'Edit Reservasi' : 'Tambah Reservasi Baru'"
      overflow
      :loading="reservation.isLoading"
    >
      <template #body>
        <!-- Date and Time -->
        <section class="grid md:grid-cols-4 sm:grid-cols-1 gap-4 mb-6">
          <div class="md:col-span-2 sm:col-span-1">
            <label for="dateTime" class="block text-sm">
              Waktu dan Tanggal
              <span class="text-red">*</span>
            </label>
            <date-picker
              v-model="form.date"
              placeholder="Tanggal Akhir"
              class="form-input rounded-md"
              required
              :disabled-dates="reservation.disabledDates"
              @input="validateInputTime"
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
              @change="validateInputTime"
            >
              <option v-for="time in reservation.timeInterval" :key="time" :value="time">
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
              <option v-for="time in allowedReservationInterval" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
        </section>

        <!-- Alert -->
        <section
          v-if="reservation.isError"
          class="w-full p-4 bg-red mb-6 flex gap-4 place-items-center"
        >
          <i class="bx bx-error-circle bx-sm text-white" />
          <p class="text-white text-sm">
            Reservasi Anda untuk tanggal <b>{{ momentFormatDateId(form.date) }}</b> tidak dapat dibuat,
            karena telah melewati waktu saat ini.
          </p>
        </section>

        <!-- Repeat Booking -->
        <section v-if="!reservation.isEdit" class="grid grid-cols-3 gap-4 mb-6">
          <div class="col-span-1">
            <label for="repeat" class="block text-sm">
              Reservasi Berulang
              <span class="text-red">*</span>
            </label>
            <select
              v-model="form.repeat_type"
              name="repeat"
              class="w-full form-input bg-white rounded-md"
              @change="updateRepeatStatus"
            >
              <option
                v-for="(name, value, index) in repeatType"
                :key="index"
                :value="value"
              >
                {{ name }}
              </option>
            </select>
          </div>
          <div class="col-span-2">
            <Daily
              v-if="form.repeat_type === 'DAILY'"
              :form-start-date="form.date"
              :form-end-date="form.end_date"
              :form-days="form.days"
              @selected:form-end-date="form.end_date = $event"
              @change:form-days="onFormDaysChange"
            />
            <Weekly
              v-if="form.repeat_type === 'WEEKLY'"
              :form-start-date="form.date"
              :form-end-date="form.end_date"
              :form-days="form.days"
              :form-week="form.week"
              @input:form-week="form.week = $event"
              @selected:form-end-date="form.end_date = $event"
              @change:form-days="onFormDaysChange"
            />
            <Monthly
              v-if="form.repeat_type === 'MONTHLY'"
              :form-start-date="form.date"
              :form-end-date="form.end_date"
              :form-days="reservation.monthly.days"
              :form-month="reservation.monthly.month"
              :form-week="reservation.monthly.week"
              @selected:form-end-date="form.end_date = $event"
              @change:form-days="reservation.monthly.days = [$event]"
              @change:form-week="reservation.monthly.week = $event"
              @change:form-month="reservation.monthly.month = $event"
            />
          </div>
        </section>

        <!-- Spaces -->
        <section v-if="!reservation.isEdit" class="mb-4">
          <label for="spaces" class="block text-sm">
            Ruangan/Aset
            <span class="text-red">*</span>
          </label>

          <!-- Multiple Select Dropdown -->
          <section>
            <div v-show="reservation.expand" class="absolute inset-0 w-full" @click="closeOptions" />
            <!-- Select Dropdown -->
            <div class="relative">
              <button class="w-full text-left form-input bg-white rounded-md cursor-pointer" @click="showOptions">
                <div class="flex justify-between ">
                  <p v-if="form.asset_ids.length">
                    <span class="text-sm text-gray3">{{ `(${form.asset_ids.length}) ` }}</span>
                    {{ selectedResources }}
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
                class="absolute flex flex-col shadow-lg border-2 border-gray3 p-2 overflow-auto bg-white h-56 w-full"
              >
                <label
                  v-for="resource in reservation.resourcesLists"
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
            Judul Kegiatan
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
        <ModalButton
          btn-type="close"
          :disabled="reservation.isLoading"
          @btn-click="closeFormReservation"
        />
        <template v-if="reservation.isEdit">
          <ModalButton
            btn-type="update"
            :disabled="formIsError"
            :loading="reservation.isLoading"
            @btn-click="handleUpdate"
          />
        </template>
        <template v-else>
          <ModalButton
            btn-type="submit"
            :disabled="formIsError"
            :loading="reservation.isLoading"
            @btn-click="addReservation"
          />
        </template>
      </template>
    </BaseModal>

    <!-- Reservation Details Modal -->
    <BaseModal modal-name="detail" modal-title="Detail Reservasi">
      <template #body>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Nama
          </div>
          <div class="md:col-span-3">
            {{ detailData.extendedProps.name || '-' }}
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
            {{ detailData.extendedProps.resourceName || '-' }}
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Waktu dan Tanggal Kegiatan
          </div>
          <div class="md:col-span-3">
            <div>{{ detailData.start && detailData.end ? getDisplayDateTimeManually(detailData.start, detailData.startStr, detailData.endStr) : '-' }}</div>
          </div>
        </div>
        <div class="md:grid md:grid-cols-5 text-sm">
          <div class="md:col-span-2 text-blue">
            Catatan/Deskripsi Kegiatan
          </div>
          <div class="md:col-span-3">
            {{ detailData.extendedProps.catatan || '-' }}
          </div>
        </div>
      </template>
      <template #buttons>
        <ModalButton v-if="!isRecurring" btn-type="delete" @btn-click="deleteData" />
        <DropdownButton v-else button-type="delete">
          <template #options>
            <button @click="deleteData">
              Hapus reservasi ini
            </button>
            <button @click="deleteAllData">
              Hapus seluruh perulangan
            </button>
          </template>
        </DropdownButton>
        <ModalButton btn-type="edit" :loading="reservation.isLoading" @btn-click="setEditInitialValues" />
      </template>
    </BaseModal>
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
import { repeatType } from '../assets/constant/enum'
import { momentFormatDateId, momentFormatTimeISO, generateTimes, momentFormatDate } from '~/utils'

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
        end_date: null,
        start_time: null,
        end_time: null,
        holder: null,
        repeat_type: 'NONE',
        repeat: false,
        days: [],
        week: 1
      },
      reservation: {
        startTime: null,
        endTime: null,
        timeInterval: generateTimes(),
        expand: false,
        resourcesLists: null,
        isError: false,
        isEdit: false,
        disabledDates: {
        // disable datepicker from unlimited past to yesterday
        // note: 86400000 is in ms = 1 day
          to: new Date(Date.now() - 86400000)
        },
        isLoading: false,
        monthly: {
          days: [1],
          week: 1,
          month: 1
        }
      },
      calendarOptions: {
        locales: allLocales,
        firstDay: 0,
        locale: 'id',
        timeZone: 'local',
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit'
        },
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
        views: {
          day: {
            titleFormat: {
              year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            }
          }
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
        dayMaxEvents: 3,
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
      clickInfo: {},
      momentFormatDateId,
      repeatType
    }
  },
  computed: {
    isRecurring () {
      const { repeatType } = this.detailData.extendedProps
      return repeatType
    },
    selectedResources () {
      const { resourcesLists } = this.reservation
      const selectedNames = resourcesLists
        .filter(resource => this.form.asset_ids.includes(resource.id))
        .map(resource => resource.name)
      return selectedNames.join(', ')
    },
    allowedReservationInterval () {
      const { timeInterval, startTime } = this.reservation
      const startTimeIndex = timeInterval.indexOf(startTime)
      const maxLength = timeInterval.length
      // if user select start time at 23:30, show only the first index
      if (startTimeIndex === maxLength - 1) {
        return timeInterval.slice(0, 1)
      }
      return timeInterval.slice(startTimeIndex + 1, maxLength)
    },
    formIsError () {
      let isRules = false
      const { monthly } = this.reservation
      switch (this.form.repeat_type) {
        case 'WEEKLY':
          isRules = !this.form.week || this.form.week > 12 || this.form.week <= 0 || /[^0-9]\d*$/.test(this.form.week) || !this.form.days.length
          break
        case 'MONTHLY':
          isRules = typeof monthly.month !== 'number' || !monthly.month || monthly.month >= 4 || monthly.month <= 0 || !Number.isInteger(monthly.month)
          break
        default:
          isRules = false
          break
      }
      const { isError } = this.reservation
      const isAssetEmpty = this.form.asset_ids ? this.form.asset_ids.length === 0 : true
      const isDaysEmpty = this.form.repeat_type === 'DAILY' && !this.form.days.length
      const isFormEmpty = [
        this.form.title
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isError || isAssetEmpty || isDaysEmpty || isFormEmpty || isRules
    }
  },
  watch: {
    'form.date' () {
      this.form.date = momentFormatDate(this.form.date)
    }
  },
  methods: {
    validateInputTime () {
      const userSelectedDate = momentFormatDate(this.form.date)
      const today = momentFormatDate(new Date())

      if (userSelectedDate !== today) {
        this.reservation.isError = false
        this.updateReservationEndTime()
        return
      }

      const [hour, minute] = this.reservation.startTime.split(':')
      const userSelectedTime = new Date().setHours(hour, minute)
      const currentTime = new Date()

      this.reservation.isError = userSelectedTime <= currentTime
      this.updateReservationEndTime()
    },
    sortResources (resources) {
      const sortedResource = resources.sort((a, b) =>
        b.resource_type.localeCompare(a.resource_type) || a.name.localeCompare(b.name)
      )
      return sortedResource
    },
    updateRepeatStatus () {
      this.form.repeat = this.form.repeat_type !== 'NONE'
      this.validateInputTime()
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
      // if user select start time at 23:30, which is the last time available
      if (startTimeIndex === timeInterval.length - 1) {
        this.reservation.endTime = timeInterval[0]
        return
      }
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
    setEditInitialValues () {
      this.clearFormReservation()
      this.reservation.isEdit = true
      const { detailData } = this
      // Set form initial data
      this.form.id = detailData.id
      this.form.title = detailData.title
      this.form.description = detailData.extendedProps.catatan
      this.form.asset_id = detailData._def.resourceIds[0]
      this.form.asset_ids = detailData._def.resourceIds
      this.form.date = momentFormatDate(detailData.startStr)
      this.form.end_date = momentFormatDate(detailData.endStr)
      this.form.holder = detailData.extendedProps.holder
      this.reservation.startTime = momentFormatTimeISO(detailData.start)
      this.reservation.endTime = momentFormatTimeISO(detailData.end)

      this.$modal.hide('detail')
      this.$modal.show('add')
    },
    async handleUpdate () {
      this.reservation.isLoading = true
      const calendarApi = this.$refs.fullCalendar.getApi()

      if (this.reservation.isEdit) {
        this.form.start_time = `${momentFormatDate(this.form.date)} ${this.reservation.startTime}`
        this.form.end_time = `${momentFormatDate(this.form.date)} ${this.reservation.endTime}`
      }

      try {
        this.$toast.info('Sedang diproses', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        const response = await this.$axios.put(`/reservation/${this.form.id}`, this.form)
        if (response) {
          this.$toast.success('Berhasil diubah.', {
            iconPack: 'fontawesome',
            duration: 5000
          })
        }
      } catch (e) {
        if (e.response.status === 403) {
          return this.showErrorToast('Anda tidak ada akses untuk mengubah data ini.')
        }
        if (e.response.status === 422) {
          const { errors } = e.response.data
          if ('asset_id' in errors) {
            return this.showErrorToast(errors.asset_id.join(', '))
          }
          return this.showErrorToast('Mohon maaf, terjadi kesalahan.')
        }
      } finally {
        this.$modal.hide('add')
        this.clearFormReservation()
        calendarApi.refetchEvents()
      }
    },
    addReservation () {
      let payload = {
        ...this.form,
        start_date: momentFormatDate(this.form.date),
        end_date: momentFormatDate(this.form.end_date),
        from: `${this.reservation.startTime}:00`,
        to: `${this.reservation.endTime}:00`
      }

      let reservationType = ''

      switch (this.form.repeat_type) {
        case 'DAILY':
          reservationType = 'daily'
          break
        case 'WEEKLY':
          reservationType = 'weekly'
          break
        case 'MONTHLY':
          reservationType = 'monthly'
          payload = {
            ...payload,
            ...this.reservation.monthly
          }
          break
        default:
          reservationType = ''
          break
      }

      const calendarApi = this.$refs.fullCalendar.getApi()
      this.reservation.isLoading = true
      this.$axios.post(`/reservation/${reservationType}`, payload).then(() => {
        this.$toast.success('Reservasi berhasil dibuat', {
          iconPack: 'fontawesome',
          duration: 5000
        })
        calendarApi.refetchEvents()
        this.reservation.isLoading = false
        this.$modal.hide('add')
      }).catch((e) => {
        this.reservation.isLoading = false
        this.$modal.hide('add')
        if (e.response.status === 403) {
          return this.showErrorToast('Anda tidak ada akses untuk menambah data ini.')
        }
        if (e.response.status === 422) {
          const { errors } = e.response.data
          if ('asset_ids' in errors) {
            return this.showErrorToast(errors.asset_ids.join(', '))
          }
          if ('days' in errors) {
            return this.showErrorToast(errors.days.join(', '))
          }
          return this.showErrorToast('Mohon maaf, terjadi kesalahan.')
        }
        return this.showErrorToast('Mohon maaf, terjadi kesalahan.')
      })
    },
    closeFormReservation () {
      this.clearFormReservation()
      this.$modal.hide('add')
    },
    clearFormReservation () {
      this.reservation.expand = false
      this.reservation.isError = false
      this.reservation.isLoading = false
      this.reservation.isEdit = false
      this.reservation.monthly = { days: [1], week: 1, month: 1 }
      this.form.title = null
      this.form.description = null
      this.form.holder = null
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
          newObj.repeatType = reservation.repeat_type
          newObj.resourceId = reservation.asset_id
          newObj.recurringId = reservation.recurring_id
          newObj.holder = reservation.holder
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
        this.reservation.resourcesLists = resources ? this.sortResources(resources) : []
        successCallback(resourcesMap)
      }).catch((e) => {
        failureCallback(e)
      })
    },
    handleDateSelect (selectInfo) {
      if (selectInfo.view.type === 'dayGridMonth') { return }
      const calendarApi = selectInfo.view.calendar
      if (toMoment(new Date(), selectInfo.view.calendar).format() < selectInfo.startStr) {
        this.$modal.show('add')
        this.clearFormReservation()
        this.reservation.startTime = toMoment(selectInfo.start, selectInfo.view.calendar).format('HH:mm')
        this.reservation.endTime = toMoment(selectInfo.end, selectInfo.view.calendar).format('HH:mm')
        this.form.asset_id = selectInfo.resource ? selectInfo.resource.id : null
        this.form.asset_ids = selectInfo.resource ? [Number(selectInfo.resource.id)] : []
        this.form.start_time = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.end_time = toMoment(selectInfo.end, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.date = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD')
        this.form.end_date = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD')
        this.form.repeat_type = 'NONE'
        this.form.week = '1'
        this.form.days = []
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
    deleteAllData () {
      const calendarApi = this.$refs.fullCalendar.getApi()
      this.$swal.fire({
        title: 'Anda yakin menghapus seluruh perulangan reservasi ini?',
        showCancelButton: true,
        type: 'warning',
        dangerMode: true
      }).then((isConfirm) => {
        if (isConfirm.value) {
          const { recurringId } = this.detailData.extendedProps
          this.$axios.delete(`/reservation/recurring/${recurringId}`).then(() => {
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
    },
    onFormDaysChange (val) {
      if (this.form.days.includes(val)) {
        this.form.days = this.form.days.filter(day => day !== val)
      } else {
        this.form.days.push(val)
      }
    },
    showErrorToast (message) {
      this.$toast.error(message, {
        iconPack: 'fontawesome',
        duration: 5000
      })
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
.fc .fc-day-past {
  background-color: #f0f0f0 !important;
}
.fc .fc-timegrid-slot-minor {
  border-style: solid !important;
}
</style>
