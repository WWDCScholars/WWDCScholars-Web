<template lang="pug">
a(@click="onClick").copyable
  slot
  .label {{ value }}
    .bubble(:class="{ 'clicked': clicked }")
      .before copy
      .after copied
  input(
    type="text",
    readonly,
    :value="value",
    ref="input"
  ).input
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Copyable extends Vue {
  @Prop({ required: true })
  value!: string

  clicked: boolean = false

  onClick() {
    const el = this.$refs['input'] as HTMLInputElement
    el.select()
    document.execCommand('copy')
    el.setSelectionRange(0, 0)
    this.clicked = true
    setTimeout(() => {
      this.clicked = false
    }, 2000)
  }
}
</script>

<style lang="sass" scoped>
.copyable
  position: relative
  display: flex
  justify-content: flex-start
  align-items: center
  cursor: pointer

  .label
    font-size: 0.8em
    margin-left: 3px

  .input
    border: 0
    pointer-events: none
    width: 0px
    height: 0px

  .bubble
    position: absolute
    display: block
    opacity: 0
    width: 60px
    height: 26px
    background-color: $sch-accent0
    color: $background-color-2
    font-size: 0.9em
    top: 0
    left: 0
    transform: translateX(100%) translateY(-100%)
    border-radius: 4px
    transition: opacity 200ms linear

    .before, .after
      position: absolute
      top: 50%
      left: 50%
      transform: translateX(-50%) translateY(-50%)
      margin-top: -1px
      text-align: center
      transition: opacity 200ms linear

    .before
      opacity: 1

    .after
      opacity: 0

    &.clicked
      .before
        opacity: 0

      .after
        opacity: 1

    &:after
      content: ''
      position: absolute
      display: block
      bottom: -5px
      left: 50%
      transform: translateX(-50%)
      border-top: 5px solid $sch-accent0
      border-left: 4px solid transparent
      border-right: 4px solid transparent

  &:hover .bubble
    opacity: 1
</style>

