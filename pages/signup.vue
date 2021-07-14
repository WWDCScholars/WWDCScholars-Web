<template lang="pug">
.container-outer
  .container-fluid
    base-section
      h2.color-blue Welcome to WWDC#[span Scholars]
      h3 Use your iCloud account to register or sign in
      p.
        If you are creating an account for the first time, or adding a new
        scholarship to an existing account, you will be required to verify your
        acceptance status by providing evidence in the form of an email
        screenshot.

      p.
        If you are new to WWDC scholarships and would like to learn more, we
        recommend you visit our #[nuxt-link(to="/about") about page].

      a(:href="signInURL").btn-sign-in Sign in with Apple ID
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { BaseSection } from '~/components'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

@Component({
  middleware: 'anonymous',
  components: { BaseSection }
})
export default class PageSignup extends Vue {
  @Auth.State
  signInURL!: string
}
</script>

<style lang="sass" scoped>

.container-outer
  position: absolute
  height: 100%

.container-fluid
  height: 100%

.section
  height: calc(100% - 40px)
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

  h2
    font-size: 2.4em
    font-weight: 700
    text-align: center

    span
      font-weight: 500

  h3
    font-size: 1.6em
    font-weight: 400
    text-align: center
    margin-bottom: 60px

  p
    width: 50%
    margin: 0 auto 20px

    a
      color: $sch-blue

  .btn-sign-in
    display: block
    margin-top: 60px
    margin-left: auto
    margin-right: auto
    padding: 10px 20px
    font-weight: 500
    color: black
    border: 1px solid black
    border-radius: $border-radius
    text-decoration: none
</style>
