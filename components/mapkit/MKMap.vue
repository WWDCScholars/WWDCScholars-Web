<template lang="pug">
.mk-map(ref="mapKitMap")
  slot
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { featureEnum } from '~/util/mapkit'

let resolveReady: (map: mapkit.Map) => void

@Component
export default class MKMap extends Vue {
  @Prop({ default: () => ({}), type: Object })
  options!: mapkit.MapConstructorOptions

  @Prop({ default: undefined, type: String })
  mapType?: string

  @Prop({ default: undefined, type: Object })
  padding?: mapkit.Padding

  @Prop({ default: undefined, type: String })
  showsCompass?: string

  @Prop({ default: undefined, type: Boolean })
  showsMapTypeControl?: boolean

  @Prop({ default: undefined, type: Boolean })
  showsZoomControl?: boolean

  @Prop({ default: undefined, type: Boolean })
  showsUserLocationControl?: boolean

  @Prop({ default: undefined, type: Boolean })
  showsPointsOfInterest?: boolean

  @Prop({ default: undefined, type: String })
  showsScale?: string

  @Prop({ default: undefined, type: String })
  tintColor?: string

  @Prop({ default: undefined, type: String })
  colorScheme?: string

  @Prop({ default: undefined, type: Object })
  center?: mapkit.Coordinate

  @Prop({ default: undefined, type: Object })
  region?: mapkit.CoordinateRegion

  @Prop({ default: undefined, type: Object })
  rotation?: number

  @Prop({ default: undefined, type: Object })
  visibleMapRect?: mapkit.MapRect

  @Prop({ default: undefined, type: Object })
  cameraBoundary?: mapkit.CameraBoundaryDescription

  @Prop({ default: undefined, type: Number })
  cameraDistance?: number

  @Prop({ default: undefined, type: Object })
  cameraZoomRange?: mapkit.CameraZoomRange

  $map?: mapkit.Map

  deferredReadyPromise = new Promise<mapkit.Map>(resolve => {
    resolveReady = resolve
  })

  async mounted() {
    await this.init()
  }

  beforeDestroy() {
    this.$map?.destroy()
  }

  async init() {
    await this.$loadMapKit()
    this.$map = new mapkit.Map(
      this.$refs.mapKitMap as any,
      this.options
    )
    resolveReady(this.$map)
  }

  @Watch('mapType')
  setMapType(mapType?: string) {
    if (mapType != 'standard' && mapType != 'satellite' && mapType != 'hybrid' && mapType != 'mutedStandard') {
      mapType = 'standard'
    }

    if (this.$map) this.$map.mapType = mapType
  }

  @Watch('padding')
  setPadding(padding?: mapkit.Padding) {
    if (padding && this.$map) this.$map.padding = padding
  }

  @Watch('showsCompass')
  setShowsCompass(showsCompass?: string) {
    if (showsCompass && this.$map) this.$map.showsCompass = featureEnum(showsCompass)
  }

  @Watch('showsMapTypeControl')
  setShowsMapTypeControl(showsMapTypeControl?: boolean) {
    if (showsMapTypeControl && this.$map) this.$map.showsMapTypeControl = showsMapTypeControl
  }

  @Watch('showsZoomControl')
  setShowsZoomControl(showsZoomControl?: boolean) {
    if (showsZoomControl && this.$map) this.$map.showsZoomControl = showsZoomControl
  }

  @Watch('showsUserLocationControl')
  setShowsUserLocationControl(showsUserLocationControl?: boolean) {
    if (showsUserLocationControl && this.$map) this.$map.showsUserLocationControl = showsUserLocationControl
  }

  @Watch('showsPointsOfInterest')
  setShowsPointsOfInterest(showsPointsOfInterest?: boolean) {
    if (showsPointsOfInterest && this.$map) this.$map.showsPointsOfInterest = showsPointsOfInterest
  }

  @Watch('showsScale')
  setShowsScale(showsScale?: string) {
    if (showsScale && this.$map) this.$map.showsScale = featureEnum(showsScale)
  }

  @Watch('tintColor')
  setTintColor(tintColor?: string) {
    if (tintColor && this.$map) this.$map.tintColor = tintColor
  }

  @Watch('colorScheme')
  setColorScheme(colorScheme?: string) {
    if (!colorScheme || !this.$map) return;
    if (colorScheme === 'dark') {
      this.$map.colorScheme = mapkit.Map.ColorSchemes.Dark
    } else {
      this.$map.colorScheme = mapkit.Map.ColorSchemes.Light
    }
  }

  @Watch('center')
  setCenter(center?: mapkit.Coordinate, animated: boolean = true) {
    if (center && this.$map) this.$map.setCenterAnimated(center, animated)
  }

  @Watch('region')
  setRegion(region?: mapkit.CoordinateRegion, animated: boolean = true) {
    if (region && this.$map) this.$map.setRegionAnimated(region, animated)
  }

  @Watch('rotation')
  setRotation(rotation?: number, animated: boolean = true) {
    if (rotation && this.$map) this.$map.setRotationAnimated(rotation, animated)
  }

  @Watch('visibleMapRect')
  setVisibleMapRect(visibleMapRect?: mapkit.MapRect, animated: boolean = true) {
    if (visibleMapRect && this.$map) this.$map.setVisibleMapRectAnimated(visibleMapRect, animated)
  }

  @Watch('cameraBoundary')
  setCameraBoundary(cameraBoundary?: mapkit.CameraBoundaryDescription, animated: boolean = true) {
    if (cameraBoundary && this.$map) {
      if (cameraBoundary.mapRect)
        this.$map.setCameraBoundaryAnimated(cameraBoundary.mapRect, animated)
      else if (cameraBoundary.region)
        this.$map.setCameraBoundaryAnimated(cameraBoundary.region, animated)
    }
  }

  @Watch('cameraDistance')
  setCameraDistance(cameraDistance?: number, animated: boolean = true) {
    if (cameraDistance && this.$map) this.$map.setCameraDistanceAnimated(cameraDistance, animated)
  }

  @Watch('cameraZoomRange')
  setCameraZoomRange(cameraZoomRange?: mapkit.CameraZoomRange, animated: boolean = true) {
    if (cameraZoomRange && this.$map) this.$map.setCameraZoomRangeAnimated(cameraZoomRange, animated)
  }
}
</script>
