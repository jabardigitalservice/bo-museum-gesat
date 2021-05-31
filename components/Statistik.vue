<template>
  <div>
    <div class="md:items-center my-4">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(card, i) in cards"
          :key="i"
          :class="['md:col-span-1 text-white p-4 rounded-md', card.bgColor]"
        >
          <div class="flex item-center">
            <div class="w-full">
              <div class="text-lg">
                {{ card.title }}
              </div>
              <div class="text-4xl font-bold flex items-center">
                <i :class="['mr-2 bx bx-md text-white', card.icon]" aria-hidden="true" />
                {{ card.value }}
              </div>
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
      // note: identifier can't use camel case
      const { all } = res.data || {}
      this.cards[0].value = all
    })
  }
}
</script>
