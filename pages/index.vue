<template>
  <div class="px-4 pb-20">
    <div class="flex flex-col">
      <h1 class="text-4xl font-normal text-gray1">
        Dashboard
      </h1>
      <div>
        <FullCalendar
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
    <modal name="add" :adaptive="true" height="auto">
      <div class="p-8 space-y-4">
        <div class="window-header mb-2">
          TAMBAH RESERVASI BARU
        </div>
        <div>
          <label for="title" class="block text-sm">
            Judul Kegiatan
            <span class="text-red">*</span>
          </label>
          <div class="mt-1">
            <input
              v-model="form.title"
              name="title"
              type="text"
              autocomplete="title"
              required
              class="form-input"
            >
          </div>
        </div>
        <div>
          <label for="description" class="block text-sm">
            Catatan / Deskripsi Kegiatan
          </label>
          <div class="mt-1">
            <textarea
              v-model="form.description"
              name="description"
              class="form-input"
            />
          </div>
        </div>
        <div class="flex space-x-4">
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-yellow text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="clearFormReservation"
          >
            Clear
          </button>
          <button
            type="button"
            class="w-full flex justify-center py-2 px-4 mt-6 rounded-md shadow-sm text-sm font-medium bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="addReservation"
          >
            Submit
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
import { toMoment } from '@fullcalendar/moment'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'
import { isAdmin } from '~/utils'
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
        description: null,
        date: null,
        start_time: null,
        end_time: null
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
          listPlugin
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimeGridDay,dayGridMonth,listWeek'
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimeGridDay',
        resources: this.getResources,
        initialEvents: [],
        events: this.getReservations,
        nowIndicator: true,
        editable: false,
        selectable: !isAdmin(this.$auth),
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
        /* you can update a remote database when these fire:
        eventAdd:

        eventRemove:
        */
      },
      // currentEvents: [],
      eventGuid: 0
    }
  },
  methods: {
    handleUpdate () {
      this.$modal.show('add')
      this.$axios.put(`/reservation/${this.form.id}`, this.form)
    },
    addReservation () {
      this.$axios.post('/reservation', this.form)
      // calendarApi.refetchEvents()
    },
    clearFormReservation () {
      this.form.title = null
      this.form.description = null
    },
    handleEventAllow (dropInfo, draggedEvent) {
      const now = new Date()
      now.setMinutes(now.getMinutes() + 30)
      if (toMoment(new Date(), draggedEvent._context.calendarApi).format() > dropInfo.startStr) {
        return false
      } else if (toMoment(now, draggedEvent._context.calendarApi).format() > draggedEvent.startStr) {
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
      this.$axios.get('/reservation?page=all').then((response) => {
        const reservations = response.data.data
        this.$axios.get('/asset/list').then((resources) => {
          const reservationsMap = reservations.map((reservation) => {
            const resource = resources.data?.data?.find((resource) => {
              return resource.name === reservation.asset_name
            })
            const newObj = {}
            newObj.id = reservation.id
            newObj.title = reservation.title
            newObj.start = toMoment(reservation.start_time).format()
            newObj.end = toMoment(reservation.end_time).format()
            newObj.resourceId = resource?.id
            newObj.extendedProps = {
              name: reservation.user_fullname,
              resourceName: reservation.asset_name,
              catatan: reservation.description
            }
            return newObj
          })
          successCallback(reservationsMap)
        }).catch(error => Promise.reject(error))
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
          newObj.eventBackgroundColor = '#219653'
          return newObj
        })
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
        this.form.asset_id = selectInfo.resource.id
        this.form.start_time = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.end_time = toMoment(selectInfo.end, selectInfo.view.calendar).format('YYYY-MM-DD HH:mm')
        this.form.date = toMoment(selectInfo.start, selectInfo.view.calendar).format('YYYY-MM-DD')
        calendarApi.unselect()
      } else {
        calendarApi.unselect()
      }
    },
    handleEventClick (clickInfo) {
      const calendarApi = clickInfo.view.calendar
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        this.$axios.delete(`/reservation/${clickInfo.event.id}`).then(() => {
          calendarApi.refetchEvents()
        })
      }
    }
  }
}
</script>
<style>
.fc-event-main {
  overflow: auto;
}
.fc-event-main::-webkit-scrollbar {
  display: none;
}
</style>
