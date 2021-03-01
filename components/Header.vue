<template>
  <div class="bg-white flex justify-between md:justify-end items-center p-4">
    <div class="md:hidden" @click="openSidebar">
      <i class="bx bx-menu bx-md cursor-pointer gray1" />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openSidebar () {
      this.$store.commit('menu/SET_MENU', true)
    }
  }
}
</script>
