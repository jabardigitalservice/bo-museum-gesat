<template>
  <div class="md:grid md:grid-cols-3 h-screen">
    <div class="md:col-span-1 bg-cover bg-center bg-primary text-white">
      <div class="relative p-8 my-auto h-full">
        <div class="text-4xl font-bold">
          JDS RESERVASI
        </div>
      </div>
    </div>
    <div class="md:col-span-2">
      <div>
        <div class="shadow sm:rounded-md sm:overflow-hidden flex sm:h-auto lg:h-screen justify-center items-center">
          <div class="bg-white w-6/12">
            <form method="POST" @submit.prevent="userLogin">
              <div class="w-full mt-4">
                <label class="block leading-5 font-medium">
                  Username
                </label>
                <div class="mt-2 flex w-full rounded-md shadow-sm">
                  <input
                    v-model="login.username"
                    name="username"
                    class="form-input"
                    placeholder="Username"
                    required
                  >
                </div>
              </div>
              <div class="w-full mt-4">
                <div class="flex justify-between">
                  <div class="text-center leading-5 font-medium">
                    Password
                  </div>
                </div>
                <div class="mt-2 relative w-full rounded-md shadow-sm">
                  <input
                    v-model="login.password"
                    name="password"
                    class="form-input"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                    required
                  >
                  <span
                    style="position: absolute; right: 5px; cursor: pointer"
                    class="absolute inset-y-0 py-2"
                    @click="showPassword = !showPassword"
                  >
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      class="w-6 h-6 z-2"
                    >
                      <path v-show="showPassword" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        v-show="showPassword"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        v-show="!showPassword"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="w-full h-full pb-8 pt-2">
                <button
                  type="submit"
                  class="rounded-md py-2 px-8 bg-primary text-white my-4 w-full border border-primary hover:bg-white hover:text-primary hover:border-primary focus:outline-none"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPassword: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    userLogin () {
      // TODO: update function login
      this.$toast.success('Login berhasil', {
        icon: 'check',
        iconPack: 'fontawesome',
        duration: 1000
      })
    }
  }
}
</script>
