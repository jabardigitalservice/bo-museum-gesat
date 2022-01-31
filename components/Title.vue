<template>
  <section>
    <div class="bg-white flex justify-between w-max-width my-4 p-4 rounded-xl shadow-sm shadow-gray-200">
      <div class="pt-2 self-end md:hidden" @click="openSidebar">
        <jds-icon class="text-black" name="menu-burger" size="lg" />
      </div>
      <h1 class="text-2xl font-semibold font-sans text-black self-center md:text-3xl">
        <slot />
      </h1>
      <div class="w-10 h-10 bg-green-700 rounded-full text-white text-2xl leading-relaxed font-bold font-sans text-center self-center">
        {{ initialUserName }}
      </div>
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    initialUserName () {
      return this.$auth.user?.name?.charAt(0) || null
    }
  },
  methods: {
    openSidebar () {
      this.$store.commit('menu/SET_MENU', true)
    }
  }
}
</script>
