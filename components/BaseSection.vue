<template lang="pug">
section.section
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class BaseSection extends Vue {}
</script>

<style lang="sass" scoped>
.section
  padding: 40px 50px
  background-color: $background-color-2
  border-radius: $border-radius-large
  +shadow

  +for-phone-only
    padding: 20px 30px
    border-radius: 0

  .subsection
    margin-bottom: 40px

    &:last-of-type
      margin-bottom: 0

  h2
    font-size: 1.8em
    text-align: left
    margin-bottom: 15px
    font-weight: 700

    +for-phone-only
      font-size: 1.6em

  h4
    font-size: 1.4em
    font-weight: 700

  +for-phone-only
    h2, h3, h4
      padding-left: 0
      padding-right: 0

    h2
      font-size: 1.6em

    h3
      font-size: 1.4em

    h4
      font-size: 1.2em

  p
    margin-top: 15px
    margin-bottom: 0
    font-size: 0.9em
</style>
