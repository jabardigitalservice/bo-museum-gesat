<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <Title>
        Kalender Reservasi
      </Title>

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
        <section class="grid md:grid-cols-2 sm:grid-cols-1 gap-2 mb-6">
          <div class="date__reservation">
            <jds-date-input
              v-model="start_date"
              name="formDateReservation"
              placeholder="Tanggal Akhir"
              label="Waktu dan Tanggal Mulai"
              @input="validateInputTime"
            />
          </div>

          <!-- Start Time -->
          <div class="start__time">
            <jds-select
              v-model="reservation.startTime"
              name="start-time"
              :options="reservation.timeInterval"
              options-header="Waktu"
              label="Dari"
              :helper-text="helperText"
              placeholder="Pilih Waktu"
              @change="validateInputTime"
            />
          </div>

          <!-- End Time -->
          <div class="end__time over">
            <jds-select
              v-model="reservation.endTime"
              name="end-time"
              :options="allowedReservationInterval"
              options-header="Waktu"
              label="Sampai"
              :helper-text="helperText"
              placeholder="Pilih Waktu"
            />
          </div>
        </section>

        <!-- Alert -->
        <section
          v-if="reservation.isError"
          class="w-full p-4 bg-red-500 mb-6 flex gap-4 place-items-center"
        >
          <i class="bx bx-error-circle bx-sm text-white" aria-hidden="true" />
          <p class="text-white text-sm">
            Reservasi Anda untuk tanggal <strong>{{ start_date }}</strong> tidak dapat dibuat,
            karena telah melewati waktu saat ini.
          </p>
        </section>

        <!-- Repeat Booking -->
        <section v-if="!reservation.isEdit" class="grid grid-cols-2 gap-4 mb-6">
          <div class="repeat__reservation col-span-1">
            <jds-select
              v-model="form.repeat_type"
              name="reservationType"
              :options="repeatType"
              options-header="Pilih Waktu"
              label="Reservasi Berulang"
              :helper-text="helperText"
              placeholder="Pilih"
              @change="updateRepeatStatus"
            />
          </div>
          <div class="col-span-2">
            <Daily
              v-if="form.repeat_type === 'DAILY'"
              :form-start-date="form.date"
              :form-end-date="endDate"
              :form-days="form.days"
              @selected:form-end-date="endDate = $event"
              @change:form-days="onFormDaysChange"
            />
            <Weekly
              v-if="form.repeat_type === 'WEEKLY'"
              :form-start-date="form.date"
              :form-end-date="endDate"
              :form-days="form.days"
              :form-week="form.week"
              @input:form-week="form.week = $event"
              @selected:form-end-date="endDate = $event"
              @change:form-days="onFormDaysChange"
            />
            <Monthly
              v-if="form.repeat_type === 'MONTHLY'"
              :form-start-date="form.date"
              :form-end-date="endDate"
              :form-days="reservation.monthly.days"
              :form-month="reservation.monthly.month"
              :form-week="reservation.monthly.week"
              @selected:form-end-date="endDate = $event"
              @change:form-days="onChangeDays"
              @change:form-week="reservation.monthly.week = $event"
              @change:form-month="reservation.monthly.month = $event"
            />
          </div>
        </section>

        <!-- Alert -->
        <section
          v-if="endDateIsError"
          class="w-full p-4 bg-red-500 mb-6 flex gap-4 place-items-center"
        >
          <i class="bx bx-error-circle bx-sm text-white" aria-hidden="true" />
          <p class="text-white text-sm">
            Rentang tanggal tidak valid(tanggal berakhir tidak boleh kurang dari tanggal mulai)
          </p>
        </section>

        <!-- Spaces -->
        <section v-if="!reservation.isEdit" class="mb-4">
          <!-- Multiple Select Dropdown -->
          <section>
            <div v-show="reservation.expand" class="absolute inset-0 w-full" @click="closeOptions" />
            <!-- Select Dropdown -->
            <div class="relative z-10">
              <jds-input-text
                :value="assetName"
                class="w-full"
                label="Ruangan/Aset"
                name="assetReservation"
                :helper-text="helperText"
                readonly
              />
            </div>
          </section>
        </section>

        <!-- Booking Name -->
        <section class="mb-4">
          <jds-input-text
            v-model="form.title"
            class="w-full"
            name="reservation__name"
            label="Judul Kegiatan"
            :helper-text="helperText"
            :error-message="errorMessageTitle"
            placeholder="Judul Maksimal 200 Karakter"
          />
        </section>

        <!-- Holder Mail -->

        <section class="mb-4">
          <jds-input-text
            v-model="form.holder"
            class="w-full"
            name="holderEmail"
            type="text"
            label="Tambahkan Email Penanggung Jawab"
            :error-message="errorMessageHolder"
            placeholder="contoh: anggarahardian@gmail.com"
          />
        </section>

        <!-- Notes/Description -->
        <section class="reservation__description">
          <jds-text-area
            v-model="form.description"
            class="w-full"
            name="description"
            label="Catatan/Deskripsi Kegiatan"
            :error-message="errorMessageDescription"
            placeholder="Deskripsi Maksimal 200 Karakter"
          />
        </section>
      </template>

      <!-- Form Buttons -->
      <template #buttons>
        <BaseButton
          variant="danger"
          label="Tutup"
          class="w-full"
          :disabled="reservation.isLoading"
          @click="closeFormReservation"
        />
        <template v-if="reservation.isEdit">
          <button
            v-if="!loading"
            type="submit"
            class="reservation__button-update"
            :class="[ !formIsError ? 'text-white bg-green-700 hover:bg-green-800' : 'text-gray-500 bg-gray-200 cursor-not-allowed']"
            :disabled="formIsError"
            @click="handleUpdate"
          >
            Update
          </button>
          <button
            v-else
            class="reservation__button-spinner"
            :class="[ !formIsError ? 'text-white bg-green-700 hover:bg-green-800' : 'text-gray-500 bg-gray-200 cursor-not-allowed']"
            :disabled="!formIsError"
          >
            <jds-spinner
              v-show="loading"
              size="16px"
            />
          </button>
        </template>
        <template v-else>
          <button
            v-if="!loading"
            type="submit"
            class="reservation__button-submit"
            :class="[ !formIsError ? 'text-white bg-green-700 hover:bg-green-800' : 'text-gray-500 bg-gray-200 cursor-not-allowed']"
            :disabled="formIsError"
            @click="addReservation"
          >
            Simpan
          </button>
          <button
            v-else
            class="reservation__button-spinner"
            :class="[ !formIsError ? 'text-white bg-green-700 hover:bg-green-800' : 'text-gray-500 bg-gray-200 cursor-not-allowed']"
            :disabled="!formIsError"
          >
            <jds-spinner
              v-show="loading"
              size="16px"
            />
          </button>
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
        <div class="md:grid md:grid-cols-5 text-sm mb-4">
          <div class="md:col-span-2 text-blue">
            Email Penanggung Jawab
          </div>
          <div class="md:col-span-3">
            {{ detailData.extendedProps.holder || '-' }}
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
        <template v-if="detailData.extendedProps.name === $auth.user.name || isAdminRole">
          <BaseButton v-if="!isRecurring" class="w-full" variant="danger" label="Hapus" @click="deleteData" />
          <DropdownButton v-else button-type="delete">
            <template #options>
              <BaseButton variant="danger" label="Hapus reservasi ini" @click="deleteData" />
              <BaseButton variant="danger" label="Hapus seluruh perulangan" @click="deleteAllData" />
            </template>
          </DropdownButton>
          <BaseButton type="button" class="w-full" label="Edit" @click="setEditInitialValues" />
        </template>
        <template v-else>
          <BaseButton variant="primary" label="Detail" @click="$modal.hide('detail')" />
        </template>
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
import { momentFormatDateId, momentFormatTimeISO, generateTimes, momentFormatDate, isAdmin } from '~/utils'

export default {
  layout: 'admin',
  components: {
    FullCalendar
  },
  data () {
    return {
      form: {
        title: '',
        asset_id: null,
        asset_ids: [],
        description: '',
        date: momentFormatDate(new Date(), 'YYYY-MM-DD'),
        end_date: '',
        start_time: null,
        end_time: null,
        holder: null,
        repeat_type: 'NONE',
        repeat: false,
        days: [],
        week: 1
      },
      start_date: momentFormatDate(new Date(), 'DD/MM/YYYY'),
      currentDate: momentFormatDate(new Date(), 'YYYY-MM-DD'),
      endDate: '',
      formDays: [],
      assetName: '',
      reservation: {
        startTime: '',
        endTime: '',
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
          days: [],
          week: null,
          month: null
        }
      },
      helperText: '* Wajib diisi',
      errorMessageTitle: '',
      errorMessageDescription: '',
      errorMessageHolder: '',
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
      repeatType,
      errorMessage: 'Mohon maaf, terjadi kesalahan.',
      dateFormat: {
        withTime: 'YYYY-MM-DD HH:mm',
        withoutTime: 'YYYY-MM-DD'
      }
    }
  },
  computed: {
    loading () {
      return this.reservation.isLoading
    },
    isAdminRole () {
      return isAdmin(this.$auth)
    },
    isRecurring () {
      const { repeatType, recurringId } = this.detailData.extendedProps
      return !!repeatType && !!recurringId
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
        case 'DAILY':
          isRules = (!this.formDays.length && !this.form.days.length) || (this.form.end_date <= this.form.date)
          break
        case 'WEEKLY':
          isRules = !this.form.week || this.form.week > 12 || this.form.week <= 0 || /[^0-9]\d*$/.test(this.form.week) || (!this.formDays.length && !this.form.days.length) || (this.form.end_date <= this.form.date)
          break
        case 'MONTHLY':
          isRules = typeof monthly.month !== 'number' || !monthly.month || monthly.month >= 4 || monthly.month <= 0 || !Number.isInteger(monthly.month) || (this.form.end_date <= this.form.date) || !(typeof monthly.week !== 'undefined' && monthly.week !== null) || !(typeof monthly.days[0] !== 'undefined')
          break
        default:
          isRules = false
          break
      }
      const { isError } = this.reservation
      const isAssetEmpty = this.form.asset_ids ? this.form.asset_ids.length === 0 : true
      const isStartDate = this.form.date < this.currentDate || !(this.form.start_date !== '')
      // regex to check email pattern like xxxx@xxxx.xxx or xxxx@xxxx.xx.xx
      const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      const isEmail = this.form.holder ? this.form.holder.match(mailFormat) : true
      const isFormTitle = this.form.title.length > 200
      const isFormDescription = this.form.description !== null && this.form.description.length > 200
      const isFormEmpty = [
        this.form.title
      ].some((value) => {
        if (typeof value === 'string') {
          return value.length === 0
        }
        return typeof value === 'undefined' || value === null
      })
      return isError || isAssetEmpty || isFormEmpty || isRules || !isEmail || isStartDate || isFormTitle || isFormDescription
    },
    endDateIsError () {
      let isError = false
      switch (this.form.repeat_type) {
        case 'DAILY':
          isError = this.endDate !== '' && this.form.end_date <= this.form.date
          break
        case 'WEEKLY':
          isError = this.endDate !== '' && this.form.end_date <= this.form.date
          break
        case 'MONTHLY':
          isError = this.endDate !== '' && this.form.end_date <= this.form.date
          break
        default:
          isError = false
          break
      }
      return isError
    }
  },
  watch: {
    'form.title' () {
      if (this.form.title !== null && this.form.title.length > 200) {
        this.errorMessageTitle = 'Judul anda melebihi 200 karakter'
      } else {
        this.errorMessageTitle = ''
      }
    },
    'form.description' () {
      if (this.form.description !== null && this.form.description.length > 200) {
        this.errorMessageDescription = 'Catatan/Deskripsi anda melebihi 200 karakter'
      } else {
        this.errorMessageDescription = ''
      }
    },
    'form.repeat_type' () {
      if (this.form.repeat_type === 'NONE') {
        this.formDays = this.form.days
      }
    },
    start_date () {
      const date = this.start_date.split('/').reverse().join('/')
      this.form.date = momentFormatDate(date, 'YYYY-MM-DD')
    },
    endDate () {
      const endDate = this.endDate.split('/').reverse().join('/')
      this.form.end_date = momentFormatDate(endDate, 'YYYY-MM-DD')
    },
    'form.holder' () {
      const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (this.form.holder === '') {
        this.form.holder = null
      } else if (this.form.holder === null) {
        this.errorMessageHolder = ''
      } else if (!this.form.holder.match(mailFormat)) {
        this.errorMessageHolder = 'Format email harus benar'
      } else {
        this.errorMessageHolder = ''
      }
    }
  },
  methods: {
    formatDate (date, pattern) {
      const dateFormat = date.split('/').reverse().join(', ')
      return momentFormatDate(dateFormat, pattern)
    },
    validateInputTime () {
      const userSelectedDate = this.formatDate(this.start_date, 'YYYY-MM-DD')
      const today = momentFormatDate(new Date(), 'YYYY-MM-DD')

      if (userSelectedDate < today) {
        this.reservation.isError = true
      } else {
        this.reservation.isError = false
        this.updateReservationEndTime()
      }

      const [hour, minute] = this.reservation.startTime.split(':')
      const date = this.start_date.split('/').reverse().join(', ')
      const userSelectedTime = new Date(date)
      userSelectedTime.setHours(hour, minute)
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
      this.form.date = momentFormatDate(detailData.startStr, 'YYYY-MM-DD')
      this.form.end_date = momentFormatDate(detailData.endStr, 'YYYY-MM-DD')
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
        this.form.start_time = `${momentFormatDate(this.form.date, 'YYYY-MM-DD')} ${this.reservation.startTime}`
        this.form.end_time = `${momentFormatDate(this.form.date, 'YYYY-MM-DD')} ${this.reservation.endTime}`
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
        if (e.response?.status === 403) {
          return this.showErrorToast('Anda tidak ada akses untuk mengubah data ini.')
        }
        if (e.response?.status === 422) {
          const { errors } = e.response.data
          if ('asset_id' in errors) {
            return this.showErrorToast(errors.asset_id.join(', '))
          }
          return this.showErrorToast(this.errorMessage)
        }
        this.showErrorToast('Mohon maaf, terjadi kesalahan.')
      } finally {
        this.$modal.hide('add')
        this.clearFormReservation()
        calendarApi.refetchEvents()
      }
    },
    handleFormDay () {
      this.formDays.map((value) => {
        if (value === 'Senin') {
          value = 1
        } else if (value === 'Selasa') {
          value = 2
        } else if (value === 'Rabu') {
          value = 3
        } else if (value === 'Kamis') {
          value = 4
        } else if (value === 'Jumat') {
          value = 5
        } else if (value === 'Sabtu') {
          value = 6
        } else if (value === 'Minggu') {
          value = 0
        }
        this.form.days.push(value)
      })
    },
    addReservation () {
      this.handleFormDay()
      let payload = {
        ...this.form,
        start_date: momentFormatDate(this.form.date, 'YYYY-MM-DD'),
        end_date: momentFormatDate(this.form.end_date, 'YYYY-MM-DD'),
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
          this.form.days = this.reservation.monthly.days
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
        if (e.response?.status === 403) {
          return this.showErrorToast('Anda tidak ada akses untuk menambah data ini.')
        }
        if (e.response?.status === 422) {
          const { errors } = e.response.data
          if ('asset_ids' in errors) {
            return this.showErrorToast(errors.asset_ids.join(', '))
          }
          if ('days' in errors) {
            return this.showErrorToast(errors.days.join(', '))
          }
          if ('date' in errors) {
            return this.showErrorToast(errors.date.join(', '))
          }
          if ('start_time' in errors) {
            return this.showErrorToast(errors.start_time.join(', '))
          }
          return this.showErrorToast(this.errorMessage)
        }
        this.showErrorToast(this.errorMessage)
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
      this.reservation.monthly = { days: [], week: null, month: null }
      this.form.title = ''
      this.form.description = ''
      this.form.holder = null
      this.formDays = []
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
        this.form.holder = draggedEvent.extendedProps.holder
        this.form.asset_id = dropInfo.resource.id
        this.form.start_time = toMoment(dropInfo.start, draggedEvent._context.calendarApi).format(this.dateFormat.withTime)
        this.form.end_time = toMoment(dropInfo.end, draggedEvent._context.calendarApi).format(this.dateFormat.withTime)
        this.form.date = toMoment(dropInfo.start, draggedEvent._context.calendarApi).format(this.dateFormat.withoutTime)
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
        this.form.start_time = toMoment(selectInfo.start, selectInfo.view.calendar).format(this.dateFormat.withTime)
        this.form.end_time = toMoment(selectInfo.end, selectInfo.view.calendar).format(this.dateFormat.withTime)
        this.form.date = momentFormatDate(toMoment(selectInfo.start, selectInfo.view.calendar).format(this.dateFormat.withoutTime), 'YYYY-MM-DD')
        this.start_date = momentFormatDate(toMoment(selectInfo.start, selectInfo.view.calendar).format(this.dateFormat.withoutTime), 'DD/MM/YYYY')
        this.form.end_date = toMoment(selectInfo.start, selectInfo.view.calendar).format(this.dateFormat.withoutTime)
        this.endDate = momentFormatDate(toMoment(selectInfo.start, selectInfo.view.calendar).format(this.dateFormat.withoutTime), 'DD/MM/YYYY')
        this.form.repeat_type = 'NONE'
        this.form.week = '1'
        this.form.days = []
        this.assetName = selectInfo.resource ? selectInfo.resource.title : ''
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
            if (e.response?.data?.code === 403) {
              return this.showErrorToast('Anda tidak ada akses untuk menghapus data ini.')
            }
            this.showErrorToast('Mohon maaf, terjadi kesalahan.')
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
            if (e.response?.data?.code === 403) {
              return this.showErrorToast('Anda tidak ada akses untuk menghapus data ini.')
            }
            this.showErrorToast('Mohon maaf, terjadi kesalahan.')
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
      if (Array.isArray(this.formDays)) {
        this.formDays = val
      } else {
        this.formDays = []
      }
    },
    onChangeDays (value) {
      this.reservation.monthly.days = [value]
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
<style lang="postcss">
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
.date__reservation .jds-calendar {
  max-width: none !important;
}
.date__reservation .jds-calendar .jds-calendar__list-of-days,
.date__reservation .jds-calendar .jds-calendar__days {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  font-family: 'Roboto' !important;
}
.reservation__button-submit,
.reservation__button-update,
.reservation__button-spinner {
  padding: 9px 16px;
  @apply rounded-lg text-base w-full font-normal leading-6 outline-none;
}
</style>
