<template lang="pug">
.btn
  slot(v-if="hasNobtnSlot", name="nobtn")
  button(
    v-else,
    :disabled="disabled",
    @click="onClick"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({ type: Boolean, default: false })
  disabled!: boolean

  @Prop({ type: String, default: undefined })
  confirm?: string

  get hasNobtnSlot(): boolean {
    return !!this.$slots.nobtn
  }

  onClick() {
    if (!this.confirm) {
      this.$emit('click')
      return
    }

    if (confirm(this.confirm)) {
      this.$emit('click')
    } else {
      // not confirmed, do nothing
    }
  }
}
</script>

<style lang="sass" scoped>
.btn
  position: relative

  button, a
    display: block
    padding: 12px 15px
    min-width: 160px
    border: 1px solid $form-border-color
    border-radius: $border-radius
    font-size: 1em
    color: $sch-accent
    background-color: $background-color-2
    text-align: center
    text-transform: none
    text-decoration: none
    transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

    +for-phone-only
      min-width: 100px

    &:hover
      background-color: lightenColor('background-gray', -6%)

  &.btn-round > .button, a
    padding: 10px 15px
    border: 2px solid $form-border-color
    border-radius: 32px

    &:hover
      background-color: $background-color
      color: $background-color-2

  .btn-confirm
    position: absolute
    max-width: 360px
    bottom: calc(100% + 4px)
    padding: 8px
    background-color: $background-color-2
    border: 1px solid $sch-accent3
    border-radius: $border-radius
    opacity: 1
    transition: opacity 100ms linear
    +shadow

    &.hidden
      opacity: 0

    .text
      font-size: 0.8em
      overflow-wrap: break-word
      white-space: pre-line

    .btn-confirm-actions
      display: flex
      justify-content: flex-end
      margin-top: 8px

      button
        margin-left: 8px
        font-size: 0.8em
        padding: 3px 8px
        min-width: auto

        &.btn-cancel
          background-color: $sch-accent0
          border-color: lightenColor('sch-accent0', 5%)

    .triangle
      position: absolute
      bottom: -20px
      left: 70px
      width: 20px
      height: 20px
      overflow: hidden

      &:after
        content: ''
        position: absolute
        display: block
        width: 10px
        height: 12px
        background-color: $background-color-2
        transform: rotate(45deg)
        top: -6px
        left: 5px
        border-bottom-right-radius: 2px
        +shadow

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .btn
    button, a
      background-color: getColor($bg)
      border-color: getColor($bg)
      color: getColor($fg)

      &:hover
        background-color: lightenColor($bg, -10%)
        border-color: lightenColor($bg, -10%)

      &:disabled
        background-color: $sch-accent1
        border-color: $sch-accent0

    &.btn-round > button, a
      background-color: getColor($fg)
      color: getColor($bg)

      &:hover
        background-color: getColor($bg)
        color: getColor($fg)
</style>
