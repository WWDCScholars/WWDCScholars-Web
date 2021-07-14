<template lang="pug">
.container-fluid
  .section
    template(v-if="error.statusCode === 404")
      h2.color-blue You seem to be lost!
      p(v-if="!error.message") The link you clicked may be broken or no longer exists.
      p(v-else) {{ error.message }}
      p: BaseButton(@click="goBack").back-button ← Go Back

    template(v-else)
      h2 Unfortunately there was a problem...
      p {{ error.message }}
</template>

<script lang="ts">
import { NuxtError } from '@nuxt/types'
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { BaseButton } from '~/components'

@Component({
  components: { BaseButton }
})
export default class PageError extends Vue {
  @Prop()
  error!: NuxtError

  goBack() {
    this.$router.go(-1)
  }
}
</script>

<style lang="sass" scoped>
p
  text-align: center

.back-button
  display: inline-block
  margin-top: 40px
</style>
