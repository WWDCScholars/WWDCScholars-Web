<template lang="pug">
.mk-search
  slot
  ul.mk-autocomplete-results(v-if="autocompleteResults.length > 0")
    li.mk-result(
      v-for="(result, index) in autocompleteResults",
      :class="{ 'mk-result-selected': (index === selectedResultIndex) }"
    ): button(@click="onResultClick(index)")
      | {{ result.displayLines[0] }}
      span(v-if="result.displayLines[1]") {{ result.displayLines[1] }}
</template>

<script lang="ts">
import { Component, Model, Vue } from 'nuxt-property-decorator'
import { throttle, debounce } from 'throttle-debounce'
import { InputText } from '../inputs'

@Component
export default class MKSearch extends Vue {
  @Model('input', { default: '' })
  value!: string

  get input(): HTMLInputElement {
    if (!this.$slots.default || !this.$slots.default[0]) {
      throw new Error('slot is not a valid html input element')
    }
    return this.$slots.default[0].elm as HTMLInputElement
  }

  search?: mapkit.Search
  searchRequestId?: number
  autocompleteResults: mapkit.SearchAutocompleteResult[] = []
  selectedResultIndex: number = -1

  async created() {
    await this.$loadMapKit()
    this.search = new mapkit.Search({
      includePointsOfInterest: false
    })
  }

  mounted() {
    this.input.onkeydown = this.onKeyDown
    this.input.onkeyup = this.onKeyUp
  }

  onKeyDown(event: KeyboardEvent): void {
    // cursor movements happen on keydown
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp' || event.code === 'Enter') {
      event.preventDefault()
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault()
      if (this.selectedResultIndex >= 0 && this.selectedResultIndex < this.autocompleteResults.length) {
        this.selectResult(this.selectedResultIndex)
      }
    } else if (event.code === 'ArrowDown') {
      event.preventDefault()
      if (this.selectedResultIndex < this.autocompleteResults.length - 1) {
        this.selectedResultIndex += 1
      }
    } else if (event.code === 'ArrowUp') {
      event.preventDefault()
      if (this.selectedResultIndex > 0) {
        this.selectedResultIndex -= 1
      }
    } else {
      this.onInput(event)
    }
  }

  onInput(event: KeyboardEvent): void {
    const value = (event.target as HTMLInputElement).value.trim()
    if (value === this.value) return
    this.$emit('input', value)
    if (value.length < 1) {
      this.autocompleteResults = []
      return
    }

    if (value.length < 1) return
    if (value.length < 5) {
      this.autocompleteInputThrottled(value)
    } else {
      this.autocompleteInputDebounced(value)
    }
  }

  autocompleteInputDebounced = debounce(500, this.autocompleteInput)
  autocompleteInputThrottled = throttle(500, this.autocompleteInput)
  autocompleteInput(input: string) {
    if (this.searchRequestId) {
      this.search?.cancel(this.searchRequestId)
    }

    this.searchRequestId = this.search?.autocomplete(input, (error, response) => {
      if (error) {
        console.error(error)
        return
      }

      this.autocompleteResults = response.results
    }) as unknown as number
  }

  onResultClick(index: number): void {
    if (index >= 0 && index < this.autocompleteResults.length) {
      this.selectResult(index)
    }
  }

  selectResult(index: number): void {
    const result = this.autocompleteResults[index]
    this.autocompleteResults = []
    this.$emit('change', result)
    this.input.blur()
  }
}
</script>

<style lang="sass" scoped>
.mk-search
  position: relative

.mk-autocomplete-results
  position: absolute
  top: 20px
  left: 0
  width: 100%
  list-style-type: none
  padding: 0
  margin: 0

  .mk-result
    padding: 2px 5px
    font-size: 0.9em

    &:first-of-type
      border-top-left-radius: $border-radius
      border-top-right-radius: $border-radius

    &:last-of-type
      border-bottom-left-radius: $border-radius
      border-bottom-right-radius: $border-radius

    button
      padding: 0
      margin: 0
      background: 0
      border: 0
      text-align: left

    span
      display: block
      font-size: 0.7em
      color: $sch-accent0

    &:hover, &.mk-result-selected
      background-color: lightgray
</style>
