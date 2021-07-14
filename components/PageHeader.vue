<template lang="pug">
header.header
  slot(name="left")

  nuxt-link(to="/").header-link
    h1
      span.wwdc WWDC
      span.scholars Scholars

  .spacer

  a(v-if="!isIOS",
    href="https://itunes.apple.com/app/scholars-of-wwdc/id1459158255?mt=8",
    target="_blank"
  ).appstore-download
    img(:src="require(`assets/images/appstore-${this.$colorMode.value}.svg`)")

  slot(name="right")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageHeader extends Vue {
  get isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }
}
</script>

<style lang="sass" scoped>
.header
  position: fixed
  width: 100%
  height: $header-height
  background-color: transparentizeColor('sch-accent4', 0.1)
  color: $background-color-2
  z-index: 1000
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 25px 0 40px

  +for-phone-only
    height: $header-height-mobile

  &:after
    content: ''
    display: block
    z-index: 999
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 1.5px
    background-color: $sch-accent2

  +for-phone-only
    padding: 0 20px 0 20px

  .header-link
    text-decoration: none
    z-index: 999

    h1
      margin: 0
      padding: 0
      line-height: 100%
      color: $sch-purple
      font-size: 2em
      font-weight: 600

      .scholars
        font-weight: 400

      +for-phone-only
        font-size: 1.2em

  .appstore-download
    margin-left: auto
    margin-right: 30px

    +for-phone-only
      display: none
</style>
