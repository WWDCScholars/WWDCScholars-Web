<template lang="pug">
.container-outer
  .container-fluid
    h2.color-green About WWDC#[span Scholars]
    h3.
      Learn about our community of scholarship winners, who we are and how you can
      get involved.

    .team-section
      .team-picture
        img(src="/images/team-members.jpg")
        .title WWDC#[span Scholars] Team

      .team-cards
        team-card(
          v-for="member in members",
          :key="member.recordName"
          :name="member.name",
          :age="member.birthday | yearDifference",
          :image="member.picture.downloadURL",
          :scholar="member.scholar"
        ) {{ member.biography }}

    .team-section
      .team-picture
        img(src="/images/team-scholars.jpg")
        .title WWDCScholarships

      base-section
        .subsection
          h4.color-red-2 What is a WWDC Scholarship?
          p.
            The #[a(href="https://developer.apple.com/wwdc/", target="_blank") Apple Worldwide Developers Conference (WWDC)]
            is a conference held annually in California by Apple Inc. The event gathers approximately 5000 developers in one place to learn about and discuss the latest software and technologies for Apple platform developers. Attendees can participate in hands-on labs with Apple engineers, and in-depth sessions covering a wide variety of topics.
          p.
            Every year, Apple rewards up to 350 talented students and STEM organization members with an opportunity to attend the conference as a scholarship winner. Individuals selected for a scholarship will receive a WWDC ticket, lodging for the conference, and one year of membership in the Apple Developer Program free of charge.

        .subsection
          h4.color-red-2 How can I apply?
          p.
            #[i Due to being held online, the WWDC Scholarship is called Swift Student Challenge in 2021. Applications are currently open. Don't miss any announcements by #[a(href="https://twitter.com/WWDCScholars", target="_blank") following us on Twitter (@WWDCScholars)].]
            The application for a WWDC scholarship consists of a combination of a Swift Playground to showcase your ingenuity and written responses to a few questions. You can #[a(href="https://developer.apple.com/wwdc21/swift-student-challenge/", target="_blank") find out more on the WWDC Website].

        .subsection
          h4.color-red-2 How do I join WWDCScholars?
          p.
            If you are a WWDC scholarship winner, you can #[a(href="https://join.wwdcscholars.com", target="_blank") sign up to create a profile on our website]. This is a great way to connect with fellow Scholars and help you to get the most out of the conference.

          p.
            Typically it takes us some time to update the signup form each year so it might not be available immediately after results are out. Be sure to #[a(href="https://twitter.com/WWDCScholars", target="_blank") follow us on Twitter (@WWDCScholars) to stay up to date].


        .subsection
          h4.color-red-2 Is there anything I can help with?
          p.
            We are always on the lookout for creative individuals and like-minded developers from all around the world to help us build our platform for WWDC scholarship winners. Our current projects include a native iOS app written in Swift as well as two Vue.js web applications for signup and this website. Everything we develop is openly #[a(href="https://github.com/WWDCScholars", target="_blank") available on GitHub]. If you are interested in contributing to any of our projects, check out the open issues of the respective repository, or create a new one to suggest an improvement or request a feature.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { MetaInfo } from 'vue-meta'
import { namespace } from 'vuex-class'
import { TeamMember } from '@wwdcscholars/cloudkit'
import {
  BaseSection,
  TeamCard
} from '~/components'

import { name as teamName } from '~/store/team'
const Team = namespace(teamName)

@Component({
  components: {
    BaseSection,
    TeamCard
  }
})
export default class PageAbout extends Vue {
  @Team.Getter('allMembers')
  members!: TeamMember[]

  head(): MetaInfo {
    return { title: 'About | WWDCScholars' }
  }

  async fetch() {
    await this.$store.dispatch('team/queryMembers')
  }
}
</script>

<style lang="sass" scoped>
.container-fluid
  padding-top: 80px

  +for-phone-only
    padding-top: 60px

h2
  font-size: 2.4em
  font-weight: 700
  text-align: center
  margin-bottom: 30px

  span
    font-weight: 500

h3
  font-size: 1.6em
  font-weight: 500
  text-align: center
  margin-bottom: 80px

+for-phone-only
  h2
    font-size: 2em

  h3
    font-size: 1.3em
    margin-bottom: 60px

.subsection
  a
    color: inherit

  p i
    display: block
    font-size: 0.8em
    margin-bottom: 6px

.team-picture
  position: relative

  img
    width: 100%
    border-radius: $border-radius-large
    +shadow

    +for-phone-only
      border-radius: 0

  .title
    position: absolute
    bottom: 8%
    left: 4%
    font-size: 2.3em
    font-weight: 700
    //picture bg is static and needs bright contrast
    color: white

    span
      font-weight: 500

    +for-phone-only
      font-size: 1.2em

.team-section
  margin-bottom: 40px

  &:last-of-type
    margin-bottom: 0

  .team-picture
    margin-bottom: 40px

.team-cards
  display: grid
  grid-template-columns: 1fr
  grid-gap: 40px

  +for-tablet-landscape-up
    grid-template-columns: 1fr 1fr
</style>
