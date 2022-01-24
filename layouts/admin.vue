<template>
  <div class="flex w-screen h-screen bg-blue2">
    <SidebarDesktop />
    <SidebarMobile />
    <div class="w-full overflow-x-auto">
      <Header />
      <Nuxt />
    </div>
    <div v-if="isActiveSidebar" class="fixed z-10 w-screen h-screen bg-gray1 opacity-50" />
  </div>
</template>
<script>
import Header from '~/components/Header.vue'
export default {
  components: { Header },
  computed: {
    isActiveSidebar () {
      return this.$store.state.menu.isActiveSidebar
    }
  }
}
</script>
