<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    :center="location.coordinates"
    :zoom="zoom"
    @load="onMapLoaded"
  >
    <MglMarker
      :coordinates.sync="location.coordinates"
      :color="COLOR_LOCATION_MARKER"
    />
  </MglMap>
</template>

<script>

import { MglMap, MglMarker } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

import { COLOR_LOCATION_MARKER } from '@/constants.js'

export default {
  props: ['location', 'zoom'],
  data () {
    return {
      accessToken: 'pk.eyJ1Ijoibmlja3NhaGxlciIsImEiOiJja2l5MG9zd2UweWdmMnJwM3pmOTBkbnZlIn0.0PlHofmWvqKzjXi_GBHYZg',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      COLOR_LOCATION_MARKER
    }
  },
  created () { this.mapbox = Mapbox },
  components: { MglMap, MglMarker },
  methods: {
    updateCoordinates (e) {
    },
    onMapLoaded (event) {
      this.map = event.map
    },
    flyTo (center, zoom = 13, speed = 1) {
      if (this.map) {
        this.map.flyTo({ center, zoom, speed })
      }
    }
  }
}
</script>
