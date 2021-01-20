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
import { cardsDashboard } from '~/assets/constant/enum'
export default {
  layout: 'admin',
  data () {
    return {
      cards: cardsDashboard
    }
  },
  mounted () {
    this.$axios.get('/dashboard/reservation-statistic').then((res) => {
      this.cards[0].value = res.data && res.data.all ? res.data.all : 0
      this.cards[1].value = res.data && res.data.already_approved ? res.data.already_approved : 0
      this.cards[2].value = res.data && res.data.rejected ? res.data.rejected : 0
    })
  }
}

</script>
