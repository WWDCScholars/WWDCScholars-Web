<template lang="pug">
.container-outer.form-color-purple
  .scholar-profile
    .profile-map
      profile-map(
        :coordinate="location",
        :annotationTitle="locationCity"
      )

    .container-fluid
      base-section(v-if="scholar")
        .image
          img(v-lazy="profilePictureURL")
        .basic-info
          h2
            span.name {{ fullName }}
            span.age {{ age }}
          h3.location {{ locationSlug }}

        p.short-bio {{ scholar.biography }}

        .social-links(v-if="socialMedia")
          a(v-if="scholar.loadedSocialMedia.twitter",
            :href="scholar.loadedSocialMedia.twitter",
            alt="Twitter",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-twitter.png")
          a(v-if="scholar.loadedSocialMedia.instagram",
            :href="scholar.loadedSocialMedia.instagram",
            alt="Instagram",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-instagram.png")
          a(v-if="scholar.loadedSocialMedia.github",
            :href="scholar.loadedSocialMedia.github",
            alt="GitHub",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-github.png")
          a(v-if="scholar.loadedSocialMedia.linkedin",
            :href="scholar.loadedSocialMedia.linkedin",
            alt="LinedIn",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-linkedin.png")
          a(v-if="scholar.loadedSocialMedia.imessage",
            :href="'imessage://' + scholar.loadedSocialMedia.imessage",
            alt="iMessage",
          ).social-icon
            img(src="~assets/images/icon-messages.png")
          a(v-if="scholar.loadedSocialMedia.facebook",
            :href="scholar.loadedSocialMedia.facebook",
            alt="Facebook",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-facebook.png")
          a(v-if="scholar.loadedSocialMedia.itunes",
            :href="scholar.loadedSocialMedia.itunes",
            alt="App Store Developer Page",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-appstore.png")
          a(v-if="scholar.loadedSocialMedia.website",
            :href="scholar.loadedSocialMedia.website",
            alt="Website",
            target="_blank"
          ).social-icon
            img(src="~assets/images/icon-website.png")

          copyable(
            v-if="scholar.loadedSocialMedia.discord",
            :value="scholar.loadedSocialMedia.discord"
          ).social-icon.social-nolink.social-discord
            img(src="~assets/images/icon-discord.png")

        .scholarships
          h3 Scholarships

          p.scholarships-blurb.
            {{ scholar.givenName }} has been awarded a WWDC scholarship
            {{ numAttended | readableNumber }}
            {{ 'time' | quantize(numAttended) }}.
            Here {{ numAttended | isAre }} the
            {{ 'submission' | quantize(numAttended) }} that got
            {{ scholar.gender | pronoun }} there.

          .submission-selector
            nuxt-link(
              v-for="({ link, activeClass }, year) in submissionLinks",
              :to="link",
              :key="year",
              :class="activeClass"
            ) {{ year }}

          nuxt-child(:scholar="scholar")

        base-button(v-if="editProfileLinkVisible").btn-round.edit-profile
          nuxt-link(slot="nobtn", to="/profile") Edit Profile
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { MetaInfo, MetaPropertyProperty, MetaPropertyName } from 'vue-meta'
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { CloudKit, Scholar, ScholarSocialMedia } from '@wwdcscholars/cloudkit'

import {
  BaseSection,
  BaseButton,
  Copyable,
  ProfileMap
} from '~/components'

import * as auth from '~/store/auth'
const Auth = namespace(auth.name)

import * as scholars from '~/store/scholars'
const Scholars = namespace(scholars.name)

@Component({
  components: {
    BaseSection,
    BaseButton,
    Copyable,
    ProfileMap
  },
  scrollToTop: true
})
export default class ScholarProfile extends Vue {
  mapKitInitialized: boolean = false
  locationSlug: string = '-'
  locationCity: string =''

  @Scholars.Getter('byRecordName') scholarByRecordName

  @Auth.State
  userScholarReference?: CloudKit.Reference

  get scholar(): Scholar | undefined {
    const { id } = this.$route.params
    return this.scholarByRecordName(id)
  }

  get fullName(): string {
    if (!this.scholar || (!this.scholar.givenName && !this.scholar.familyName)) return ''
    return this.scholar.givenName + ' ' + this.scholar.familyName
  }

  get age(): string {
    if (!this.scholar || !this.scholar.birthday) return ''
    const birthday = dayjs(this.scholar.birthday)
    return `${dayjs().diff(birthday, 'year')}`
  }

  get socialMedia(): ScholarSocialMedia | undefined {
    if (!this.scholar || !this.scholar.loadedSocialMedia || Object.keys(this.scholar.loadedSocialMedia.fields).length <= 1) return undefined

    return this.scholar.loadedSocialMedia
  }

  get profilePictureURL(): string {
    if (!this.scholar || !this.scholar.profilePicture) return ''

    return this.scholar.profilePicture.downloadURL
  }

  get location(): mapkit.Coordinate | undefined {
    if (!this.scholar || !this.scholar.location || !this.mapKitInitialized) return undefined

    return new mapkit.Coordinate(this.scholar.location.latitude, this.scholar.location.longitude)
  }

  get mapZoom(): number {
    if (!this.scholar || !this.scholar.location) return 0

    return 6
  }

  get numAttended(): number {
    if (!this.scholar || !this.scholar.wwdcYears) return 0
    return this.scholar.wwdcYears.length
  }

  get submissionLinks(): { [year: string]: object } {
    if (!this.scholar || !this.scholar.wwdcYearsApproved) return {}
    const sortedYears = this.scholar.wwdcYearsApproved.slice().sort((lhs, rhs) => lhs.recordName.localeCompare(rhs.recordName))
    const lastYearReference = sortedYears[sortedYears.length - 1]
    return sortedYears
      .reduce((acc, yearReference) => {
        const year = yearReference.recordName.substring(5)
        const yearParam = yearReference.recordName === lastYearReference.recordName ? undefined : year
        const exactActive = !yearParam && this.$route.params.year === lastYearReference.recordName.substring(5)
          ? 'nuxt-link-exact-active'
          : undefined

        acc[year] = {
          link: {
            name: 's-id-year',
            params: {
              id: this.$route.params.id,
              year: yearParam
            }
          },
          activeClass: exactActive
        }

        return acc
      }, {})
  }

  get editProfileLinkVisible(): boolean {
    return this.userScholarReference !== undefined
      && this.userScholarReference.recordName === this.scholar?.recordName
  }

  head(ctx): MetaInfo {
    const title = `${this.fullName} | WWDCScholars`
    const description = this.scholar?.biography ?? ''
    const url = `${process.env.baseUrl}/s/${this.$route.params.id}`

    return {
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        // { property: 'og:type', content: 'profile', hid: 'og:type' },
        // { property: 'og:title', content: title, hid: 'og:title' },
        // { property: 'og:description', content: description, hid: 'og:description' },
        // { property: 'og:image', content: this.profilePictureURL, hid: 'og:image' },
        // { property: 'og:image:alt', content: title, hid: 'og:image:alt' },
        // { property: 'og:url', content: url, hid: 'og:url' },
        // { name: 'twitter:card', content: 'summary', hid: 'twitter:card' },
        // { name: 'twitter:title', content: title, hid: 'twitter:title' },
        // { name: 'twitter:description', content: description, hid: 'twitter:description' },
        // { name: 'twitter:image', content: this.profilePictureURL, hid: 'twitter:image' },
        // { name: 'twitter:image:alt', content: title, hid: 'twitter:image:alt' },
        // { name: 'twitter:url', content: url, hid: 'twitter:url' }
      ],
      link: [
        { rel: 'canonical', href: url, hid: 'canonical' }
      ]
    }
  }

  validate({ params }): boolean {
    return /\b[0-9A-F]{8}\b-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-\b[0-9A-F]{12}\b/.test(params.id)
  }

  async fetch() {
    try {
      await this.$store.dispatch('scholars/fetchScholar', this.$route.params.id)
    }
    catch (e) {
       this.$nuxt.error({
        message: 'The Scholar could not be found',
        statusCode: 404
      })
      return
    }

    const scholar: Scholar = this.$store.getters['scholars/byRecordName'](this.$route.params.id)
    if (!scholar) {
      return
    }

    // TODO: Maybe we don't have to await this.
    await this.$store.dispatch('scholars/loadSocialMediaIfMissing', {
      scholarRecordName: scholar.recordName,
      socialMediaRecordName: scholar.socialMedia.recordName
    })
  }

  async created() {
    await this.$loadMapKit()
    this.mapKitInitialized = true
    this.loadLocationSlug(this.location, undefined)
  }

  @Watch('location')
  loadLocationSlug(newLocation?: mapkit.Coordinate, oldLocation?: mapkit.Coordinate): void {
    if (!newLocation || (newLocation.latitude === oldLocation?.latitude && newLocation.longitude == oldLocation?.longitude)) return

    const geocoder = new mapkit.Geocoder()
    geocoder.reverseLookup(newLocation, (error, response) => {
      if (error) {
        console.error(error)
        return
      }

      if (!response.results[0]) return
      const result = response.results[0]

      let slugComponents: string[] = []
      if (result.locality) slugComponents.push(result.locality)
      if (result.administrativeAreaCode) slugComponents.push(result.administrativeAreaCode)
      if (result.country) slugComponents.push(result.country)
      else slugComponents.push(result.countryCode)

      this.locationSlug = slugComponents.join(', ')
      this.locationCity = result.locality ?? ''
    })
  }

  extendRoute(year?: string): object {
    const route = this.$route
    return {
      name: route.name,
      params: {
        id: route.params.id,
        year: year
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.profile-map
  width: 100%
  height: 360px
  position: relative
  background-color: $sch-accent0

.section
  position: relative
  margin-top: -30px
  padding: 30px 120px

  +for-phone-only
    padding: 30px 20px

  .image
    position: relative
    width: 185px
    height: 185px
    margin-top: -150px

    +for-phone-only
      margin: -125px auto 0 auto

    img
      width: 100%
      height: 100%
      object-fit: cover
      border: 8px solid $background-color-2
      background-color: $sch-accent2
      border-radius: 50%
      overflow: hidden
      box-sizing: border-box
      +shadow

      &[lazy="loading"], &[lazy="error"]
        padding: 37%

  h2
    margin-top: 40px
    margin-bottom: 5px
    font-size: 1.8em
    font-weight: 700
    color: $sch-purple

    .age
      margin-left: 10px
      color: $sch-purple-3

    +for-phone-only
      margin-top: 20px
      font-size: 1.4em

  .location
    font-size: 1.2em
    font-weight: 500
    color: $sch-label-2

    +for-phone-only
      font-size: 1em

  .short-bio
    margin-top: 30px
    font-size: 0.9em
    white-space: pre-line

  .social-links
    display: flex
    justify-content: flex-start
    align-items: center
    margin-top: 30px

    .social-icon
      margin-right: 15px

      img
        width: 32px
        height: 32px

      &.social-nolink
        img
          width: 24px
          height: 24px

    .social-discord
      height: 32px
      padding-left: 15px
      color: $sch-accent
      border-left: 1px solid $sch-accent1

      &:first-of-type
        border-left: 0

  .scholarships
    margin-top: 40px

    h3
      font-size: 1.6em
      font-weight: 700
      color: $sch-purple

      +for-phone-only
        font-size: 1.2em

  .submission-selector
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-wrap: wrap
    margin-top: 15px
    margin-bottom: 15px

    a
      position: relative
      padding: 7px 15px
      font-weight: 500
      color: $sch-purple
      border: 2px solid $sch-purple
      border-radius: 22px
      text-decoration: none
      margin-right: 15px
      margin-bottom: 15px
      transition: background-color 100ms linear, color 100ms linear

      &:hover
        background-color: $sch-purple
        color: $background-color-2

      &.nuxt-link-exact-active
        font-weight: 700
        background-color: $sch-purple
        color: $background-color-2
        +shadow

        &:after
          content: ''
          position: absolute
          display: block
          bottom: -10px
          left: calc(50% - 8px)
          border-top: 8px solid $sch-purple
          border-right: 8px solid transparent
          border-left: 8px solid transparent

  .edit-profile
    position: absolute
    top: 30px
    right: 30px

    +for-phone-only
      display: none
</style>
