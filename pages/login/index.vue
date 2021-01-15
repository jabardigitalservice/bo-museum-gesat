<template>
  <div class="w-screen bg-white h-screen" />
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
    this.$auth.loginWith('keycloak')
  }
}
</script>
