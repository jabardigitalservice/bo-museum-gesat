<template>
  <div class="flex w-screen h-screen">
    <SidebarDesktop />
    <SidebarMobile />
    <div class="w-full overflow-x-auto pt-8">
      <Nuxt />
    </div>
    <div v-if="isActiveSidebar" class="fixed z-10 w-screen h-screen bg-gray1 opacity-50" />
  </div>
</template>
<script>
export default {
  computed: {
    isActiveSidebar () {
      return this.$store.state.menu.isActiveSidebar
    }
  }
}
</script>
