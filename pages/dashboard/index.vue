<template>
  <div>
    <div class="md:items-center p-4">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
      </div>
    </div>
    <div class="md:items-center p-4">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(card, i) in cards"
          :key="i"
          :class="['md:col-span-1 text-white p-4 rounded-md', card.bgColor]"
        >
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-4 w-full">
              <div class="text-lg">
                {{ card.title }}
              </div>
              <div class="text-4xl font-bold">
                {{ card.value }}
              </div>
            </div>
            <div class="md:col-span-1 flex justify-center items-center w-full">
              <i :class="['bx bx-md text-white', card.icon]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'admin',
  data () {
    return {
      // TODO: get data statistic dashboard from api and apply to each value
      cards: [
        {
          title: 'Reservasi Dibuat',
          value: 0,
          bgColor: 'bg-blue',
          icon: 'bx-calendar'
        },
        {
          title: 'Reservasi Disetujui',
          value: 0,
          bgColor: 'bg-primary',
          icon: 'bx-calendar-check'
        },
        {
          title: 'Reservasi Ditolak',
          value: 0,
          bgColor: 'bg-red',
          icon: 'bx-calendar-x'
        }
      ]
    }
  }
}

</script>
