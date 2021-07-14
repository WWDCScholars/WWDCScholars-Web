<template lang="pug">
.input-text(:class="{ 'input-has-value': inputHasValue }")
  label
    slot(
      v-if="$slots.default"
    )
    input(
      v-else-if="type === 'email'"
      type="email",
      :name.once="name",
      :disabled="disabled",
      :value="value",
      @input="update($event.target.value)"
    )
    input(
      v-else-if="type === 'url'",
      type="url",
      :name.once="name",
      :disabled="disabled",
      :value="value",
      @input="update($event.target.value)"
    )
    input(
      v-else-if="type === 'search'",
      :name.once="name",
      :disabled="disabled",
      :value="value",
      @input="update($event.target.value)"
    )
    autosize-textarea(
      v-else-if="type === 'textarea'",
      :name.once="name",
      :disabled="disabled",
      :value="value",
      :maxLength="maxLength",
      @input="update($event)"
    )
    input(
      v-else,
      type="text",
      :name.once="name",
      :disabled="disabled",
      :value="value",
      @input="update($event.target.value)",
    )
    span.title {{ placeholder }}
    span.optional(v-if="!required") Optional
  .comment(v-if="type === 'textarea'") {{ Math.max(maxLength - length, 0) }} / {{ maxLength }} characters remaining
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import AutosizeTextarea from './AutosizeTextarea.vue'

@Component({
  components: { AutosizeTextarea }
})
export default class InputText extends Vue {
  @Model('input')
  value!: string

  @Prop({ default: 'text' })
  type!: string
  @Prop({ required: true })
  name!: string
  @Prop({ default: '' })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean
  @Prop({ default: false })
  disabled!: boolean
  @Prop({ default: 0 })
  maxLength!: number

  value_validate: string = this.value || '' // tslint:disable-line

  update(value) {
    const trimmedValue = value.trim()
    this.value_validate = trimmedValue
    this.$emit('input', trimmedValue)
  }

  get length() {
    return this.value ? this.value.length : 0
  }

  get inputHasValue() {
    return this.value && this.value.length > 0
  }
}
</script>

<style lang="sass" scoped>
.input-text
  width: 100%

  label
    display: block
    position: relative

  input, textarea
    width: 100%
    font-size: 1em
    padding: 20px 15px 5px 15px
    background-color: $background-color-2
    border: 1px solid $form-border-color
    border-radius: $border-radius
    color: $sch-label
    appearance: none
    transition: border-color 100ms linear, box-shadow 100ms linear

    &:disabled
      color: $sch-accent0
      -webkit-text-fill-color: $sch-accent0

  textarea
    padding-top: 10px

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
    top: 2px
    right: 15px
    transform: translateY(50%)
    font-size: 0.9em

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')

  .input-text
    input, textarea
      &:hover, &:focus
        border-color: getColor($bg)

      &:focus
        box-shadow: 0 0 4px transparentizeColor($bg, 0.6)

      &:focus + .title
        color: getColor($bg)
</style>
