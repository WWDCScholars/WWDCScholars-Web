<template lang="pug">
.input-image
  .image
    input(
      type="file",
      :name="name",
      :accept="accept",
      :required="required",
      @change="onChange"
    )
    slot(name="icon")
      img(src="~assets/images/upload-icon.png").upload-icon
    .preview-wrapper
      img(
        v-if="preview",
        :src="preview"
      ).preview
    button(
      v-if="value",
      @click="clear"
    ).button-remove
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'nuxt-property-decorator'

@Component
export default class InputImage extends Vue {
  @Model('input')
  value!: File | string | null

  @Prop({ required: true })
  name!: string
  @Prop({ default: 'image/*' })
  accept!: string
  @Prop({ default: false })
  required!: boolean

  preview: string | null = null

  created() {
    this.updatePreview()
  }

  onChange(event) {
    const input = event.srcElement || event.target
    if (!input.files || !input.files[0]) return

    const file = input.files[0]
    this.$emit('input', file)
  }

  @Watch('value')
  updatePreview() {
    if (typeof this.value === 'string') {
      this.preview = this.value
    } else if (this.value instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (!e.target) {
          this.preview = ''
          return
        }
        this.preview = e.target['result'] as string
      }
      reader.readAsDataURL(this.value as File)
    } else {
      this.preview = null
    }
  }

  clear() {
    this.$emit('input', null)
  }
}
</script>

<style lang="sass" scoped>
.image
  position: relative
  width: 100
  height: 100%
  background-color: $background-color-2
  border: 1px solid $form-border-color
  border-radius: $border-radius
  cursor: pointer
  transition: border-color 100ms linear, box-shadow 100ms linear

  input
    width: 100%
    height: 100%
    opacity: 0
    cursor: pointer

  .upload-icon
    display: block
    position: absolute
    top: 50%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    width: 40px
    height: 40px
    pointer-events: none

  .preview-wrapper
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    padding: 15px
    pointer-events: none

    .preview
      width: 100%
      height: 100%
      border: 0
      object-fit: cover

  .button-remove
    position: absolute
    top: 5px
    right: 5px
    width: 20px
    height: 20px
    border-radius: 10px
    border: 0
    background-color: $sch-red
    padding: 0

    &:before, &:after
      content: ''
      position: absolute
      top: 9px
      left: 4px
      width: 12px
      height: 2px
      border-radius: 1.5px
      background-color: $background-color-2

    &:before
      transform: rotate(-45deg)

    &:after
      transform: rotate(45deg)

+form-colors
  $bg: dyn-temp('bg')
  .input-image
    .image:hover
      border-color: getColor($bg)
      box-shadow: 0 0 4px transparentizeColor($bg, 0.6)
</style>
