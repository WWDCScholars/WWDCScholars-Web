<template lang="pug">
.container-outer
  .tab-bar-container
    navigation-tab-bar.form-color-purple.years-tab-bar
      nuxt-link(
        v-for="(linkObject, year) in yearLinks",
        :to="linkObject.link",
        :key="year",
        :class="{ 'nuxt-link-exact-active': linkObject.customExactActive }"
      ) {{ year }}
  .container-fluid.color-purple
    .scholars-list.scholars-list-loading(v-if="$fetchState.pending && currentScholars.length < 1")
      .scholar-thumbnail-loading(v-for="index in 6", :key="index")
    .scholars-list(v-else-if="currentScholars.length > 0")
      scholar-thumbnail(
        v-for="scholar in currentScholars",
        :scholar.once="scholar",
        :key="scholar.recordName"
      )
    .no-scholars(v-else) #[i Unfortunately there are no Scholars to show yet]&nbsp;&nbsp;😭
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Scholar, WWDCYear } from '@wwdcscholars/cloudkit'
import { NavigationTabBar, ScholarThumbnail } from '~/components'

import { name as yearsName } from '~/store/years'
const Years = namespace(yearsName)
import { name as scholarsName } from '~/store/scholars'
const Scholars = namespace(scholarsName)

@Component({
  components: {
    NavigationTabBar,
    ScholarThumbnail
  }
})
export default class PageIndex extends Vue {
  @Years.State('years')
  allYears!: { [recordName: string]: WWDCYear }

  @Years.Getter('sortedKeys')
  sortedYearKeys!: string[]

  @Scholars.State('scholars')
  allScholars!: { [recordName: string]: Scholar }

  get latestYear(): WWDCYear {
    const keys = this.sortedYearKeys
    return this.allYears[keys[keys.length - 1]]
  }

  get currentYear(): WWDCYear {
    if (this.$route.params.year) {
      return this.allYears[`WWDC ${this.$route.params.year}`]
    }

    return this.latestYear
  }

  get yearLinks(): { [year: string]: object } {
    return this.sortedYearKeys.reduce((acc, key) => {
      const record = this.allYears[key]
      const params = record === this.latestYear ? {} : { year: record.year }
      const customExactActive = record === this.latestYear && (record.year == this.$route.params.year || !this.$route.params.year)
      acc[record.year] = {
        customExactActive,
        link:{
          name: 'scholars-year',
          params
        }
      }
      return acc
    }, {})
  }

  get currentScholars(): Scholar[] {
    if (!this.currentYear) return []
    const currentYearRecordName = this.currentYear.recordName
    return Object.values(this.allScholars)
      .filter(scholar => {
        return scholar.wwdcYearsApproved && scholar.wwdcYearsApproved.some(yearReference => yearReference.recordName === currentYearRecordName)
      })
      .sort((lhs, rhs) => lhs.givenName.localeCompare(rhs.givenName))
  }

  validate({ params }): boolean {
    if (!params.year) return true
    const year = params.year
    return /^\d{4}$/.test(year)
  }

  async fetch() {
    await this.$store.dispatch('years/queryYears')
    const years = this.$store.state.years.years

    let year: WWDCYear

    if (this.$route.params.year) {
      year = years[`WWDC ${this.$route.params.year}`]
    } else {
      const keys = this.$store.getters['years/sortedKeys']
      year = years[keys[keys.length - 1]]
    }
    if (!year) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404
      }

      throw new Error('The requested year could not be found in our database.')
    }

    await this.$store.dispatch('scholars/queryScholars', year)
  }
}
</script>

<style lang="sass" scoped>
.years-tab-bar
  min-height: 60px

.scholars-list
  margin-top: 30px
  display: grid
  grid-template-columns: repeat(auto-fill, 160px)
  grid-auto-rows: 160px
  grid-gap: 15px
  justify-content: center

  &.scholars-list-loading
    grid-template-rows: 160px 0 0 0

  .scholar-thumbnail
    display: block

  .scholar-thumbnail-loading
    border-radius: $border-radius-large
    background-color: $background-color
    background-image: linear-gradient(to top, $background-color, transparentizeColor('sch-accent3', 0.9)), linear-gradient(to right, $sch-accent3 0%, $background-color 20%, $sch-accent3 40%, $sch-accent3 100%)
    background-repeat: no-repeat
    background-size: 800% 100%
    animation-name: shimmer
    animation-duration: 1s
    animation-fill-mode: forwards
    animation-iteration-count: infinite
    animation-timing-function: linear

@keyframes shimmer
  0%
    background-position: top right

  100%
    background-position: top left

.no-scholars
  margin-top: 30px
  text-align: center
  color: $sch-accent0
</style>
