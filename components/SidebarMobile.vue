<template>
  <transition name="slide">
    <div v-if="isActiveSidebar" v-click-outside="closeSidebar" class="w-64 fixed z-20 h-screen py-4 bg-white sidebar">
      <Menu />
    </div>
  </transition>
</template>
<script>
import vClickOutside from 'v-click-outside'
export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  computed: {
    isActiveSidebar () {
      return this.$store.state.menu.isActiveSidebar
    }
  },
  methods: {
    closeSidebar () {
      this.$store.commit('menu/SET_MENU', false)
    }
  }
}
</script>
<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(-100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.sidebar{
  box-shadow: 6px 0px 10px 0px rgba(0,0,0,0.2)
}
</style>
