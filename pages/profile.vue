<template lang="pug">
.container-outer.form-color-purple(v-if="!$fetchState.pending && scholar")
  navigation-tab-bar
    nuxt-link(to="/profile") Basic
    nuxt-link(to="/profile/social") Social
    nuxt-link(to="/profile/submissions") Submissions
    nuxt-link(to="/profile/account") Account

  nuxt-child
.container-outer(v-else-if="$fetchState.pending")
  .container-fluid
    .loading-section
      loading-spinner()
.container-outer(v-else)
  .container-fluid
    .error-section
      h2.color-purple Looks like you don't have a profile yet
      p You can sign up at #[a(href="https://join.wwdcscholars.com") join.wwdcscholars.com].
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { namespace } from 'vuex-class'
import { Scholar } from '@wwdcscholars/cloudkit'
import { LoadingSpinner, NavigationTabBar } from '~/components'

import { name as authName } from '~/store/auth'
const Auth = namespace(authName)

import { name as profileName } from '~/store/profile'
const Profile = namespace(profileName)

@Component({
  middleware: 'authenticated',
  components: { LoadingSpinner, NavigationTabBar }
})
export default class PageProfile extends Vue {
  @Auth.State('pendingPromise')
  authPendingPromise!: Promise<void>

  @Profile.Getter
  scholar?: Scholar

  head(): MetaInfo {
    return { title: 'Profile | WWDCScholars' }
  }

  async fetch() {
    await this.authPendingPromise
    await this.$store.dispatch('profile/loadScholar')
  }
}
</script>

<style lang="sass" scoped>
.error-section
  padding: 40px 10px
  text-align: center

  a
    color: $sch-label

.loading-section
  padding: 40px 10px
  text-align: center
</style>
