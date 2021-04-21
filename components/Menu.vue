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
      <span class="font-medium text-white pr-4 text-center">{{ this.$auth.user && this.$auth.user.name ? this.$auth.user.name : '' }}</span>
    </div>
    <div class="mt-8">
      <ul>
        <li v-for="parent in parentMenus" :key="parent.id" class="pl-4">
          <div class="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div class="flex-grow flex flex-col">
              <nav class="flex-1 px-2 space-y-1" aria-label="Sidebar">
                <div class="space-y-1">
                  <div class="text-white group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium" :aria-controls="parent.id" aria-expanded="false">
                    <i :class="['bx bx-sm text-white', parent.iconClass]" aria-hidden="true" />
                    <strong class="ml-1">{{ parent.label }}</strong>
                  </div>
                  <div v-for="menu in menus" :id="parent.id" :key="menu.path" class="space-y-1">
                    <div v-if="parent.id == menu.parent">
                      <NuxtLink :to="menu.path" class="group submenu hover:text-gray hover:bg-gray-500">
                        <i :class="['bx bx-sm text-white', menu.iconClass]" aria-hidden="true" />
                        <div class="ml-1">
                          {{ menu.label }}
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </li>
        <li v-for="menu in menus" :key="menu.path" class="pl-6">
          <div v-if="menu.parent == 0">
            <div class="space-y-1 pt-4">
              <NuxtLink :to="menu.path" class="text-white group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium">
                <i :class="['bx bx-sm text-white', menu.iconClass]" aria-hidden="true" />
                <strong class="ml-1">{{ menu.label }}</strong>
              </NuxtLink>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { menus, parentMenus } from '~/assets/constant/enum'
import { isAdmin } from '~/utils'
export default {
  data () {
    return {

    }
  },
  computed: {
    menus () {
      const list = menus.filter((menu) => {
        if (this.isAdmin(this.$auth)) {
          if (menu.role.includes('admin_reservasi')) {
            return menu
          }
        } else if (menu.role.includes('employee_reservasi')) {
          return menu
        }
      })
      return list
    },
    parentMenus () {
      const list = parentMenus.filter((menu) => {
        if (this.isAdmin(this.$auth)) {
          if (menu.role.includes('admin_reservasi')) {
            return menu
          }
        } else if (menu.role.includes('employee_reservasi')) {
          return menu
        }
      })
      return list
    }
  },
  methods: {
    isAdmin
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
.submenu {
  @apply w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-white rounded-md;
}
</style>
