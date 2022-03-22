<template>
  <div>
    <div class="flex justify-center">
      <img width="48" height="48" src="~assets/icon/icon-digiteam.svg" alt="digiteam">
      <h1 class="text-primary text-2xl leading-14 self-center font-bold font-sans">
        JDS Reservasi
      </h1>
    </div>
    <div class="mt-6 mx-24 py-1 w-16 h-16 bg-primary rounded-full text-white text-4xl font-bold font-sans text-center">
      {{ initialUserName }}
    </div>
    <div class="flex justify-center mt-3">
      <span class="font-medium text-primary pr-4 text-center">{{ fullUserName }}</span>
    </div>
    <div class="mt-8 font-sans">
      <ul>
        <li v-for="parent in parentMenus" :key="parent.id" class="pl-4">
          <div class="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div class="flex-grow flex flex-col">
              <nav class="flex-1 px-2 space-y-1" aria-label="Sidebar">
                <div class="space-y-1">
                  <div class="text-primary group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium" :aria-controls="parent.id" aria-expanded="false">
                    <jds-icon name="home-outline" />
                    <strong class="ml-1">{{ parent.label }}</strong>
                  </div>
                  <div v-for="menu in menus" :id="parent.id" :key="menu.path" class="space-y-1">
                    <div v-if="parent.id == menu.parent">
                      <NuxtLink :to="menu.path" class="group submenu hover:text-gray-200 hover:bg-gray5">
                        <i :class="['bx bx-sm text-primary', menu.iconClass]" aria-hidden="true" />
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
              <NuxtLink :to="menu.path" class="text-primary group w-full flex items-center pl-7 pr-2 py-2 text-sm font-medium">
                <jds-icon name="door-exit" rotate="180" />
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
      commandCenter: process.env.featureCommandCenter
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
            if (this.commandCenter) {
              return menu
            } else {
              return menu.id === 1
            }
          }
        } else if (menu.role.includes('employee_reservasi')) {
          if (this.commandCenter) {
            return menu
          } else {
            return menu.id === 1
          }
        }
      })
      return list
    },
    initialUserName () {
      return this.$auth.user?.name?.charAt(0) || null
    },
    fullUserName () {
      return this.$auth.user?.name || null
    }
  },
  methods: {
    isAdmin
  }
}
</script>
<style lang="postcss" scoped>
span {
  margin-left: 20px;
}
a.nuxt-link-exact-active {
  @apply bg-gray5;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.submenu {
  @apply w-full flex items-center pl-10 pr-2 py-2 text-sm font-medium text-primary rounded-md;
}
</style>
