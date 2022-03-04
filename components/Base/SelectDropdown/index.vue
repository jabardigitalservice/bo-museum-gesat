<template>
  <jds-popover
    :value="isShow"
    immediate
    :options="dataOption"
  >
    <template #activator>
      <div
        class="multiple-select"
      >
        <jds-input-text
          ref="inputText"
          :value="`${selectedOptionValue}`"
          readonly
          label="Hari"
          placeholder="Hari"
          helper-text="* Wajib diisi"
          @click.native="toggleDropdown"
        >
          <template #suffix-icon>
            <jds-icon
              :class="
                {
                  'multiple-select__triger-icon' : true,
                  'multiple-select__triger-icon--open': isShow,
                  'multiple-select__triger-icon--close': !isShow
                }
              "
              name="chevron-down"
              size="1em"
              fill="#069550"
            />
          </template>
        </jds-input-text>
      </div>
    </template>
    <div class="jds-select-content mt-2">
      <jds-popover-dropdown
        header-text="Pilih Hari"
      >
        <jds-checkbox-group
          v-bind="{
            options,
            labelKey,
            valueKey,
            ...$attrs
          }"
          :value="mValue"
          @change="onOptionsValueChanged"
        />
      </jds-popover-dropdown>
    </div>
  </jds-popover>
</template>

<script>

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    orientation: {
      type: String,
      default: 'vertical'
    },
    label: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dropdownOpen: false,
      closeDropdown: false,
      isClicked: false,
      isShow: false,
      mValue: [],
      dataOption: {
        position: 'fixed',
        placement: 'bottom',
        offset: [0, 8],
        headerText: 'Text'
      }
    }
  },
  computed: {
    selectedOptionValue () {
      return this.mValue.reduce((acc, curr) => {
        return acc + '' + curr + ', '
      }, '')
    }
  },
  methods: {
    toggleDropdown () {
      this.isShow = !this.isShow
    },
    onOptionsValueChanged (val) {
      this.mValue = val
      this.$emit('change', this.mValue)
    }
  }
}
</script>

<style lang="scss" scooped>

.multiple-select * {
  cursor: pointer;
}
.multiple-select__triger-icon--open {
  transform: rotate(180deg);
  transition-timing-function: ease-out;
  transition-duration: 0.3s;
}
.multiple-select__triger-icon--close {
  transform: rotate(0deg);
  transition-timing-function: ease-out;
  transition-duration: 0.3s;
}
</style>
