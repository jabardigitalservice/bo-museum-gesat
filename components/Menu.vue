<template>
  <div>
    <div class="flex justify-center">
      <h1 class="text-white text-2xl font-medium font-sans">
        JDS Reservasi
      </h1>
    </div>
    <div class="flex justify-center">
      <div class="mt-6 w-16 h-16 bg-white rounded-full" />
    </div>
    <div class="flex justify-center mt-3">
      <span class="font-medium text-white">{{
        this.$auth.user !== null ? this.$auth.user.name : ""
      }}</span>
    </div>
    <div class="mt-8">
      <ul>
        <li v-for="menu in menus" :key="menu.path" class="pl-4">
          <NuxtLink :to="menu.path" class="flex items-center py-4 pl-8">
            <i :class="['bx bx-sm text-white', menu.iconClass]" />
            <span class="text-md font-medium text-white">{{ menu.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import constMenus from '@/constants/menus'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  data () {
    return {
      role: ''
    }
  },
  computed: {
    menus () {
      const menus = constMenus.filter((menu) => {
        if (menu.role.includes(this.role)) {
          return menu
        }
      })
      return menus
    },
    isAdmin () {
      if (this.checkRole().realm_access.roles.includes('admin_reservasi')) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    checkRole () {
      const tokenBearer = this.$auth.strategy.token.get()
      const token = tokenBearer.split(' ')
      const tokendecode = VueJwtDecode.decode(token[1])
      return tokendecode
    }
  }
}
</script>
<style scoped>
span {
  margin-left: 20px;
}
a.nuxt-link-exact-active {
  background: #008444;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
</style>
