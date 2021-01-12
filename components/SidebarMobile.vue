<template>
  <transition name="slide">
    <div v-if="isActiveSidebar" v-click-outside="closeSidebar" class="w-64 fixed z-20 h-screen py-4 bg-primary sidebar">
      <div class="flex justify-center">
        <h1 class="text-white text-2xl font-medium font-sans">
          JDS Reservasi
        </h1>
      </div>
      <div class="flex justify-center">
        <div class="mt-6 w-16 h-16 bg-white rounded-full" />
      </div>
      <div class="mt-8">
        <ul>
          <li class="pl-4">
            <NuxtLink to="/dashboard" class="flex items-center py-4 pl-8">
              <i class="bx bx-home bx-sm text-white" />
              <span class="text-md font-medium text-white">Dashboard</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/reservasi" class="flex items-center py-4 pl-8">
              <i class="bx bx-calendar bx-sm text-white" />
              <span class="text-md font-medium text-white">Reservasi</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/resource" class="flex items-center py-4 pl-8">
              <i class="bx bx-cabinet bx-sm text-white" />
              <span class="text-md font-medium text-white">Resource/Aset</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/" class="flex items-center py-4 pl-8">
              <i class="bx bx-log-out bx-sm text-white" />
              <span class="text-md font-medium text-white">Logout</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
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
span {
  margin-left: 20px;
}
a.nuxt-link-exact-active {
  background: #008444;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.sidebar{
  box-shadow: 6px 0px 10px 0px rgba(0,0,0,0.2)
}
</style>
