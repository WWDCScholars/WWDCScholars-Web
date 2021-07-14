<template lang="pug">
.container-fluid.color-gray
  section.section
    h2.color-blue Welcome to WWDCScholars!
    h3.color-blue Sign In with your Apple ID to Manage Your Profile

    p.
      Are you a WWDC Scholarship or Swift Student Challenge Winner? You can showcase your submission by signing up at #[a(href="https://join.wwdcscholars.com") join.wwdcscholars.com]!

    p.
      If you are new to WWDC scholarships and would like to learn more, we
      recommend you visit our #[nuxt-link(to="/about") about page].

    p: i.
      Do you have a legacy WWDCScholars profile with email and password credentials? Sign in at #[a(href="https://join.wwdcscholars.com") join.wwdcscholars.com] and follow the instructions to link your profile to your iCloud account. This is required to make your existing profile public again.

    hr

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
export default class PageSignin extends Vue {
  @Auth.State
  signInURL!: string
}
</script>

<style lang="sass" scoped>
.section
  text-align: center

  h2
    font-size: 2em
    font-weight: 600
    text-align: center
    margin-bottom: 30px

  h3
    font-size: 1.4em
    font-weight: 500
    text-align: left
    margin-bottom: 10px

  p
    margin: 0 auto 20px
    text-align: left

    a
      color: $sch-blue

    i
      font-size: 0.9em

      a
        color: $sch-accent

    +for-phone-only
      padding-left: 15px
      padding-right: 15px

  hr
    margin: 50px -15px

  .btn-sign-in
    display: inline-block
    padding: 10px 20px
    font-weight: 500
    color: $sch-label
    background-color: $background-color-2
    border: 1px solid $sch-label
    border-radius: $border-radius
    text-decoration: none
</style>
