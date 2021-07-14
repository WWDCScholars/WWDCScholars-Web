<template lang="pug">
component(:is="rootComponent", :to="profileLink").team-card-link
  base-section.team-card
    .image
      img(v-lazy="image")
    .info
      .name {{ name }}
      .age {{ age }}
      .body
        slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { CloudKit } from '@wwdcscholars/cloudkit'
import BaseSection from './BaseSection.vue'

@Component({
  components: { BaseSection }
})
export default class TeamCard extends Vue {
  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  age!: string
  @Prop({ required: true })
  image!: string
  @Prop({ default: undefined })
  scholar?: CloudKit.Reference

  get profileLink(): object | undefined {
    if (!this.scholar) return undefined

    return {
      name: 's-id-year',
      params: {
        id: this.scholar.recordName
      }
    }
  }

  get rootComponent(): string {
    return this.scholar ? 'nuxt-link' : 'div'
  }
}
</script>

<style lang="sass" scoped>
.team-card-link
  display: block
  text-decoration: none

.team-card
  display: flex
  justify-content: flex-start
  align-items: center
  color: $sch-label

  +for-phone-only
    flex-direction: column

.image
  margin-right: 20px

  +for-phone-only
    margin-right: 0
    margin-bottom: 10px

  img
    width: 80px
    height: 80px
    object-fit: cover
    border: 4px solid $background-color-2
    border-radius: 50%
    +shadow

    &[lazy="loading"]
      padding: 5%

.name, .age
  display: inline
  font-size: 1.4em
  font-weight: 700


.name
  color: $sch-purple
  margin-right: 8px

.age
  color: $sch-purple-3

.body
  margin-top: 8px
  font-size: 0.9em
</style>
