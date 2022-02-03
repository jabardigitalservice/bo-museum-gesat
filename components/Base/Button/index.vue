<template>
  <jds-button
    v-bind="{...$props,...$attrs}"
    v-on="$listeners"
  >
    <slot name="icon" />
    <slot />
  </jds-button>
</template>
<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button'
    }
  }
}
</script>
