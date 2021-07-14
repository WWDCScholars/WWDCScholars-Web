<template lang="pug">
.profile-button(:class="{ 'nuxt-link-active': linkActive }")
  .auth-pending(v-if="isAuthPending"): loading-spinner
  nuxt-link(v-else-if="!isAuthenticated", to="/signin")
    SignInOutIcon
  button(v-else, @click="open = !open")
    UserIcon
    .dropdown(:class="{ show: open }")
      .triangle
      .links
        nuxt-link(v-if="profileLink", :to="profileLink") Profile
        nuxt-link(to="/profile") Edit Profile
        button(@click="onSignOutClicked")
          | Sign Out
          #sign-out-icon
            SignInOutIcon
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { CloudKit } from '@wwdcscholars/cloudkit'
import LoadingSpinner from './LoadingSpinner.vue'

import UserIcon from '~/assets/images/user.svg?inline'
import SignInOutIcon from '~/assets/images/sign-in-out.svg?inline'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name);

@Component({
  components: { LoadingSpinner, UserIcon, SignInOutIcon },
})
export default class ProfileButton extends Vue {
  open: boolean = false

  @Auth.State('isPending')
  isAuthPending!: boolean

  @Auth.Getter
  isAuthenticated!: boolean

  @Auth.State
  userScholarReference?: CloudKit.Reference

  @Auth.Action
  signOut!: () => Promise<void>

  get linkActive(): boolean {
    if (!this.$route.name) return false

    return this.$route.name.indexOf('profile') === 0
      || this.$route.name === 'signin'
  }

  get profileLink(): object | undefined {
    if (!this.userScholarReference) return undefined

    return {
      name: 's-id-year',
      params: {
        id: this.userScholarReference.recordName
      }
    }
  }

  onSignOutClicked() {
    this.signOut()
    this.$router.replace('/')
  }
}
</script>

<style lang="sass" scoped>
.profile-button
  width: 82px
  border-bottom: $header-indicator-height solid transparent
  transition: border-bottom-color 100ms linear

  &:hover, &.nuxt-link-active
    border-bottom-color: $sch-purple

  > button, > a
    display: flex
    height: #{$header-height - $header-indicator-height}
    padding: 0 25px
    align-items: center
    color: $sch-purple

  .auth-pending
    display: flex
    height: #{$header-height - $header-indicator-height}
    padding: 0 25px
    align-items: center

button
  border: 0
  background: 0

  .dropdown
    display: none
    position: absolute
    top: #{$header-height - 13px}
    right: 15px
    z-index: 1000
    background-color: $background-color-2
    border-radius: $border-radius-large
    +shadow

    &.show
      display: block

    .links
      border-radius: $border-radius-large
      overflow: hidden

    a, button
      display: block
      font-size: 1.2em
      font-weight: 500
      color: $sch-purple
      background-color: $background-color-2
      text-decoration: none
      break-word: none
      padding: 15px 25px
      border-bottom: 1px solid $sch-accent2
      text-align: left
      transition: color 100ms linear, background-color 100ms linear

      #sign-out-icon
        display: inline-block
        position: relative
        height: 1em
        width: 1em
        top: 4px
        left: 10px
        margin-right: 5px

        path
          // does not work, bc css is not applied to svg
          transition: fill 100ms linear

      &:last-child
        border-bottom: 0

      &:hover
        color: $background-color-2
        background-color: $sch-purple

    .triangle
      position: absolute
      top: -20px
      right: 42px
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
        top: 14px
        left: 5px
        border-top-left-radius: 2px
        +shadow
</style>
