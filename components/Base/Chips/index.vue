<template>
  <div class="chips-group">
    <div
      :class="
        [{
           'chips': true
         },
         colorVariant
        ]"
    >
      <span>
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'online'
    }
  },
  computed: {
    colorVariant () {
      return {
        'chips--online': this.variant === 'online',
        'chips--offline': this.variant === 'offline',
        'chips--active': this.variant === 'active',
        'chips--non-active': this.variant === 'non-active'
      }
    }
  }
}
</script>

<style lang="postcss">
.chips-group {
  @apply inline-block;
}
.chips {
  @apply text-sm text-center border py-1 px-2 leading-4 rounded-full text-white;
}

.chips--online {
    @apply bg-blue-700;
  }

.chips--offline {
    @apply bg-gray-500;
  }

.chips--active {
    @apply bg-green-700;
  }

.chips--non-active {
    @apply bg-red-700;
  }
</style>
