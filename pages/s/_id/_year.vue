<template lang="pug">
.submission(v-if="wwdcYear && yearInfo")
  p.challenge-description
    span(v-if="challengeDescription")
      | {{ challengeDescription }}&nbsp;
    span(v-if="yearInfo.description").
      Here’s how {{ scholar.givenName }} describes
      {{ scholar.gender | possessivePronoun }} winning submission.

  p.description {{ yearInfo.description }}

  swiper(
    v-if="yearInfo.screenshots && yearInfo.screenshots.length",
    :options="swiperOptions"
  ).screenshots
      swiper-slide(
        v-for="(screenshot, index) in yearInfo.screenshots",
        :key="index"
      ).screenshot
        img(:src="screenshot.downloadURL")
      .swiper-pagination(slot="pagination")
      img(slot="button-prev", src="~assets/images/arrow-left.png").swiper-button-prev.swiper-button
      img(slot="button-next", src="~assets/images/arrow-left.png").swiper-button-next.swiper-button
  .no-screenshots(v-else)
    i Unfortunately we don't have any screenshots of this submission.
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { SwiperOptions } from 'swiper'
import { Scholar, WWDCYear, WWDCYearInfo, CloudKit } from '@wwdcscholars/cloudkit'
import { routeMatchYear, yearMatchYearInfo } from '~/util/wwdcYear-index'

import 'swiper/css/swiper.css'

import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)

@Component({
  components: {
    Swiper, SwiperSlide
  }
})
export default class ScholarProfileSubmission extends Vue {
  @Prop({ required: true })
  scholar!: Scholar

  @Years.Getter('byRecordName')
  yearByRecordName!: (recordName: string) => WWDCYear | undefined

  @Years.Action
  fetchYear!: (recordName: string) => Promise<void>

  @Scholars.Action('loadYearInfoIfMissing')
  scholarLoadYearInfoIfMissing!: (payload: { scholarRecordName: string, yearInfoRecordName: string }) => Promise<void>

  get wwdcYearReference(): CloudKit.Reference | undefined {
    if (!this.scholar) return undefined
    return routeMatchYear(this.scholar.wwdcYearsApproved, this.$route.params.year)
  }

  get wwdcYear(): WWDCYear | undefined {
    if (!this.wwdcYearReference) return undefined
    return this.yearByRecordName(this.wwdcYearReference.recordName)
  }

  get yearInfo(): WWDCYearInfo | undefined {
    if (!this.scholar || !this.wwdcYearReference) return undefined
    return this.scholar.loadedYearInfos[this.wwdcYearReference.recordName]
  }

  get challengeDescription(): string {
    if (!this.wwdcYear) return ''
    return this.wwdcYear.challengeDescription || ''
  }

  get swiperOptions(): SwiperOptions {
    const shouldLoop = (this.yearInfo?.screenshots?.length ?? 0) > 1

    return {
      autoplay: {
        delay: 8000,
        disableOnInteraction: true
      },
      loop: shouldLoop,
      grabCursor: false,
      setWrapperSize: false,
      spaceBetween: 15,
      slidesPerView: 'auto',
      centeredSlides: true,
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next'
      },
      pagination: {
        el: '.swiper-pagination'
      }
    }
  }

  validate({ params }): boolean {
    if (!params.year) return true
    return /\d{4}/.test(params.year)
  }

  async fetch() {
    if (!this.scholar || !this.wwdcYearReference) return

    // load data for year
    const yearInfoReference = yearMatchYearInfo(this.scholar.wwdcYearInfos, this.scholar.wwdcYearsApproved, this.wwdcYearReference.recordName)
    if (!yearInfoReference) return

    await Promise.all([
      this.fetchYear(this.wwdcYearReference.recordName),
      this.scholarLoadYearInfoIfMissing({
        scholarRecordName: this.scholar.recordName!,
        yearInfoRecordName: yearInfoReference.recordName
      })
    ])
  }

  @Watch('$route.params')
  onParamsChanged() {
    this.$fetch()
  }
}
</script>

<style lang="sass" scoped>
.challenge-description
  font-size: 0.85em
  font-style: italic
  color: $sch-label-2

.description
  font-size: 0.9em
  white-space: pre-line

.screenshots
  position: relative
  left: -60px
  right: -60px
  width: calc(100% + 120px)
  height: 300px
  margin-top: 40px

  +for-phone-only
    left: -20px
    right: -20px
    width: calc(100% + 40px)

  .screenshot
    width: auto

    img
      max-width: 100vw
      height: 100%
      object-fit: contain

.no-screenshots
  font-size: 0.8em
  text-align: center

$swiper-arrow-width: 34px
$swiper-arrow-height: 52px
.swiper-container
  .swiper-button
    background: 0
    width: $swiper-arrow-width
    height: $swiper-arrow-height
    margin-top: -$swiper-arrow-height / 2
    opacity: 0.5
    transition: opacity 100ms linear
    outline: 0

    &.swiper-button-next
      transform: rotate(180deg)

    &.swiper-button-disabled
      opacity: 0

  /deep/.swiper-pagination-bullets
    opacity: 0.7
    transition: opacity 100ms linear

    .swiper-pagination-bullet
      background-color: $background-color-2
      box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.5)
      opacity: 1

    .swiper-pagination-bullet-active
      background-color: $sch-purple

  &:hover .swiper-button, &:hover .swiper-pagination-bullets
    opacity: 1

    &.swiper-button-disabled
      opacity: 0
</style>
