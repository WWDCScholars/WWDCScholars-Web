<template lang="pug">
.navigation
  nav.navigation-large
    nuxt-link(to="/", :class="scholarsLinkActive").nuxt-link-root.color-purple: span Scholars
    //- nuxt-link(to="/activity").color-orange: span Activity
    //- nuxt-link(to="/store").color-blue: span Store
    nuxt-link(to="/about").color-green: span About
    profile-button
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ProfileButton from './ProfileButton.vue'

@Component({
  components: { ProfileButton }
})
export default class NavigationDesktop extends Vue {
  get scholarsLinkActive(): object {
    return {
      'nuxt-link-profile-active': this.$route.name === 's-id-year' || this.$route.name === 'scholars-year'
    }
  }
}
</script>

<style lang="sass" scoped>
.navigation
  display: flex
  justify-content: flex-end
  align-items: center

.navigation-large
  display: flex
  align-items: stretch

  +for-phone-only
    display: none

  > a
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    font-size: 1.2em
    font-weight: 500
    padding: 0 15px
    text-decoration: none
    border-bottom: $header-indicator-height solid transparent
    transition: 100ms linear border-color

    span
      font-weight: 500
      font-size: 1.1em

    &.nuxt-link-exact-active,
    &.nuxt-link-profile-active,
    &.nuxt-link-active:not(.nuxt-link-root),
    &:hover
      border-bottom: $header-indicator-height solid
</style>
