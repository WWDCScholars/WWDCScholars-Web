<template lang="pug">
footer
  span(class="links")
    nuxt-link(to="/imprint") Imprint
    span.separator
    nuxt-link(to="/privacy") Privacy Policy
    //- span.separator
    //- a(href="https://netlify.com", target="_blank") Hosted on Netlify
    span.separator
    a(href="https://plausible.io/wwdcscholars.com", target="_blank") Stats
  span(class="color")
    ColorModePicker
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ColorModePicker from './ColorModePicker.vue'

@Component({
  components: { ColorModePicker }
})
export default class PageFooter extends Vue {}
</script>

<style lang="sass" scoped>
footer
  padding: 50px 15% 0px 15%
  margin-bottom: 25px
  font-size: 0.7em
  display: flex
  justify-content: center


  .links
    // float: left

  .color
    // position: relative
    // top: -4px

footer span
  display: flex
  justify-content: center
  align-items: center
  margin: 25px

  a
    color: $sch-accent0
    text-decoration: none
    transition: color linear 100ms

    &:hover
      text-decoration: underline
      color: $sch-purple

  .separator
    width: 1px
    height: 0.8em
    background-color: $sch-accent0
    margin: 0 10px
</style>
