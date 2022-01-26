<template>
  <section>
    <div class="bg-white flex justify-between w-max-width my-4 p-4 rounded-xl shadow-sm shadow-gray6">
      <div class="pt-2 self-end md:hidden" @click="openSidebar">
        <jds-icon class="text-[#000000]" name="menu-burger" size="lg" />
      </div>
      <h1 class="text-2xl font-semibold font-sans text-[#000000] self-center md:text-3xl">
        <slot />
      </h1>
      <div class="w-10 h-10 bg-primary rounded-full text-white text-2xl leading-relaxed font-bold font-sans text-center self-center">
        {{ initialUserName }}
      </div>
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    initialUserName () {
      return this.$auth.user && this.$auth.user.name ? this.$auth.user.name.charAt(0) : null
    }
  },
  methods: {
    openSidebar () {
      this.$store.commit('menu/SET_MENU', true)
    }
  }
}
</script>
