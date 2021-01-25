<template>
  <div class="bg-white h-16 flex justify-between md:justify-end items-center p-4">
    <div class="md:hidden" @click="openSidebar">
      <i class="bx bx-menu bx-md cursor-pointer gray1" />
    </div>
    <div
      v-if="false"
      v-click-outside="clickOutAvatar"
      class="bg-gray5 h-10 w-10 rounded-full cursor-pointer relative flex justify-end"
      @click="toggleAvatar"
    >
      <transition name="fade">
        <div
          v-if="isActiveAvatar"
          class="bg-gray6 absolute h-32 w-48 profile rounded-md shadow-lg"
        />
      </transition>
    </div>
  </div>
</template>
<script>
import vClickOutside from 'v-click-outside'
export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  data () {
    return {
      isActiveAvatar: false
    }
  },
  methods: {
    openSidebar () {
      this.$store.commit('menu/SET_MENU', true)
    },
    toggleAvatar () {
      this.isActiveAvatar = !this.isActiveAvatar
    },
    clickOutAvatar () {
      this.isActiveAvatar = false
    }
  }
}
</script>
<style scoped>
.profile {
  top: calc(2.5rem + 4px);
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
