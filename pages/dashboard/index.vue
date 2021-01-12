<template>
  <div>
    <div class="md:items-center p-4">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
      </div>
    </div>
    <div class="md:items-center p-4">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div class="md:col-span-1 bg-blue text-white p-4 rounded-md">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-4 w-full">
              <div class="text-lg">
                Reservasi Dibuat
              </div>
              <div class="text-4xl font-bold">
                0
              </div>
            </div>
            <div class="md:col-span-1 flex justify-center items-center w-full">
              <i class="bx bx-calendar bx-md text-white" />
            </div>
          </div>
        </div>
        <div class="md:col-span-1 bg-primary text-white p-4 rounded-md">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-4 w-full">
              <div class="text-lg">
                Reservasi Disetujui
              </div>
              <div class="text-4xl font-bold">
                0
              </div>
            </div>
            <div class="md:col-span-1 flex justify-center items-center w-full">
              <i class="bx bx-calendar-check bx-md text-white" />
            </div>
          </div>
        </div>
        <div class="md:col-span-1 bg-red text-white p-4 rounded-md">
          <div class="md:grid md:grid-cols-5 flex item-center">
            <div class="md:col-span-4 w-full">
              <div class="text-lg">
                Reservasi Ditolak
              </div>
              <div class="text-4xl font-bold">
                0
              </div>
            </div>
            <div class="md:col-span-1 flex justify-center items-center w-full">
              <i class="bx bx-calendar-x bx-md text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'admin'
}

</script>
