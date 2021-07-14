<template lang="pug">
ValidationProvider(
  tag="div",
  :rules="rules",
  :name="name",
  :vid="vid",
  v-slot="validation"
).field
  slot(v-bind="validation")
  .input-error(v-if="validation.errors[0]") {{ validation.errors[0] }}
  .comment(v-if="comment") {{ comment }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ValidationProvider } from 'vee-validate'

@Component({
  components: { ValidationProvider }
})
export default class FormField extends Vue {
  @Prop({ default: '' })
  comment!: string
  @Prop({ default: '' })
  rules!: string | object
  @Prop({ required: true })
  name!: string
  @Prop({ default: undefined })
  vid?: string
}
</script>

<style lang="sass" scoped>
.input-error
  font-size: 0.7em
  margin-left: 2px
  margin-top: 3px
  color: $sch-red

/deep/ .comment
  color: $sch-accent
  margin-top: 15px
  font-size: 1em
</style>

