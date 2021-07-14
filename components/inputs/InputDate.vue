<template lang="pug">
.input-date(:class="{ 'input-has-value': inputHasValue }")
  label
    //- NOTE: flat-pickr does not have a darkmode!
    flat-pickr(
      ref="fp",
      :config.once="config",
      :value="value",
      @input="update($event)"
    )
    span.title {{ placeholder }}
    span.optional(v-if="!required") Optional
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import FlatpickrComponent from 'vue-flatpickr-component'
// import * as flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

@Component({
  components: {
    'flat-pickr': FlatpickrComponent
  }
})
export default class InputDate extends Vue {
  @Model('input', { default: () => new Date() })
  value!: string | Date

  @Prop({ required: true })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean
  @Prop({ default: false })
  onlyPast!: boolean
  @Prop({ required: true })
  displayFormat!: string

  value_validate: string | Date = this.value || '' // tslint:disable-line

  config?: { dateFormat: string; maxDate: (Date | undefined); } = undefined

  created() {
    this.config = {
      dateFormat: this.displayFormat,
      maxDate: undefined
    }
    if (this.onlyPast) {
      this.config.maxDate = new Date()
    }
  }

  update(value) {
    this.value_validate = value
    this.$emit('input', value)
  }

  get inputHasValue() {
    return this.value
  }
}
</script>

<style lang="sass" scoped>
.input-date
  width: 100%

  label
    display: block
    position: relative

  input
    width: 100%
    font-size: 1em
    padding: 20px 15px 5px 15px
    background-color: $background-color-2
    border: 1px solid $form-border-color
    border-radius: $border-radius
    color: $sch-label
    transition: border-color 100ms linear, box-shadow 100ms linear

  .title
    position: absolute
    top: 50%
    left: 15px
    transform: translateY(-50%)
    color: $sch-accent
    pointer-events: none
    transition: all 100ms linear

  input:focus + .title, &.input-has-value .title
      top: 12px
      font-size: 0.7em

  .optional
    position: absolute
    color: $sch-accent
    top: 50%
    right: 15px
    transform: translateY(-50%)
    font-size: 0.9em

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .input-date
    input
      &:hover, &:focus
        border-color: getColot($bg)
      &:focus
        box-shadow: 0px 0px 4px transparentizeColor($bg, 0.6)
      &:focus + .title
        color: getColor($bg)
</style>

<style lang="sass">
+form-colors
  $bg: dyn-temp('bg')
  .input-date
    .flatpickr-mobile
      width: 100%
      padding: 15px 15px 5px 15px
      font-size: 1em
      height: calc(1em + 25px)
      border: 1px solid $form-border-color
      border-radius: $border-radius
      color: $sch-accent
      appearance: none
      &:focus
        color: getColor($bg)
        border: 1px solid getColor($bg)
</style>
