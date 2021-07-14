<template lang="pug">
.tab-bar-container(ref="tabBar")
  tab-bar
    slot
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'
import TabBar from './TabBar.vue'

@Component({
  components: { TabBar }
})
export default class NavigationTabBar extends Vue {
  observer?: MutationObserver

  mounted() {
    this.observer = new MutationObserver(() => {
      this.scrollSelectedIntoView()
    })

    const foo = (this.$refs.tabBar as Element).children[0]
    this.observer.observe(foo, { childList: true })

    this.scrollSelectedIntoView()
  }

  beforeDestroy() {
    this.observer?.disconnect()
  }

  private scrollSelectedIntoView() {
    const tabBar = this.$refs.tabBar as Element
    const activeLink = tabBar.getElementsByClassName('nuxt-link-exact-active')
    if (activeLink[0]) {
      activeLink[0].scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'center'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.tab-bar-container
  width: 100%
  text-align: center
  background-color: $background-color-2
  box-shadow: 0 2px 4px 0 transparentizeColor('sch-accent', 0.6)
  overflow-x: scroll
  position: relative
</style>
