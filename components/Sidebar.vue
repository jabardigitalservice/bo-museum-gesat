<template>
  <transition name="fade">
    <div class="hidden md:block w-11/12 md:w-64 h-screen py-4 bg-primary">
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
              <span class="text-md  font-medium text-white">Dashboard</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/test" class="flex items-center py-4 pl-8">
              <i class="bx bx-calendar bx-sm text-white" />
              <span class="text-md  font-medium text-white">Reservasi</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/" class="flex items-center py-4 pl-8">
              <i class="bx bx-cabinet bx-sm text-white" />
              <span class="text-md  font-medium text-white">Resource/Aset</span>
            </NuxtLink>
          </li>
          <li class="pl-4">
            <NuxtLink to="/" class="flex items-center py-4 pl-8">
              <i class="bx bx-log-out bx-sm text-white" />
              <span class="text-md  font-medium text-white">Logout</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<style scoped>
span{
  margin-left: 20px;
}
/* exact link will show the primary color for only the exact matching link */
a.nuxt-link-exact-active {
  background: #008444;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
</style>
<script>
export default {}
</script>
