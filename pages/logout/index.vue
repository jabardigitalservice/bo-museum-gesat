<template>
  <div />
</template>
<script>
export default {
  created () {
    this.$auth.logout('keycloak')
  }
}
</script>
