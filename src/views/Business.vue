<template>
  <div class="flex flex-col text-left">
    <div class="py-4 flex flex-col">
      <transition name="fade-in-left" tag="div" mode="out-in" appear v-if="business">
        <BusinessCard :business="business" :expanded="true" />
      </transition>
      <h2
        v-if="hasLocations"
        class="text-xl text-bold pb-2"
      >
        Locations
      </h2>
      <div
        class="locations flex flex-row flex overflow-hidden md:flex row border
        border-gray-600 mb-6 shadow rounded h-64"
        v-if="hasLocations"
      >
        <div class="flex-grow flex-1 flex flex-col pad-6">
          <div
            class="flex flex-col"

            v-for="location in business.locations"
            :class="isSelected(location) ? 'flex-grow' : ''"
            :key="location.id"
            @click="() => setSelectedLocation(location)"
          >
            <div
              class="name p-4 border-gray-600 cursor-pointer border-t z-20
              -m-px transition-colors duration-300 hover:bg-gray-200"

              :class="[ isSelected(location) ? 'border-b border-gray-300 bg-gray-200' : '' ]"
            >{{location.name}}</div>
            <div
              class="border-b border-gray-300 flex flex-row z-1"
              v-if="isSelected(location)"
            >
              <div class="border-r font-bold px-4 p-2">Address:</div>
              <div class="p-2 text-gray-800 flex-1">
                {{location.postal_address ? location.postal_address : 'No Postal Address Provided'}}
              </div>
            </div>
          </div>
        </div>
        <MglMap
          class="h-full border-l border-gray-600 flex-grow flex-1 z-30"
          :accessToken="accessToken"
          :mapStyle.sync="mapStyle"
          :center="(selectedLocation.coordinates || [0, 0])"
          :zoom="9"
          @load="onMapLoaded"
        >
          <MglMarker
            v-for="location in business.locations"
            :key="location.id"
            :coordinates="location.location.coordinates"
            color="COLOR_LOCATION_MARKER"
          />
        </MglMap>
      </div>
    </div>
  </div>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
import { GET_BUSINESS_BY_ID } from '@/queries'
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker } from 'vue-mapbox'
import { COLOR_LOCATION_MARKER } from '@/constants.js'

export default {
  props: ['id'],
  components: { BusinessCard, MglMap, MglMarker },
  data () {
    return {
      accessToken: 'pk.eyJ1Ijoibmlja3NhaGxlciIsImEiOiJja2l5MG9zd2UweWdmMnJwM3pmOTBkbnZlIn0.0PlHofmWvqKzjXi_GBHYZg',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      selectedLocation: null,
      COLOR_LOCATION_MARKER
    }
  },
  created () { this.mapbox = Mapbox },
  methods: {
    setSelectedLocation (location) {
      this.selectedLocation = location
      this.flyTo(this.selectedLocation.location.coordinates)
    },
    onMapLoaded (event) {
      this.map = event.map
      this.flyTo(this.selectedLocation.location.coordinates)
    },
    flyTo (center, zoom = 13, speed = 1) {
      this.map.flyTo({ center, zoom, speed })
    },
    isSelected (location) {
      return this.selectedLocation.id === location.id
    }
  },
  computed: {
    hasLocations () {
      return this.business && this.business.locations.length > 0
    }
  },
  watch: {
    business () {
      this.setSelectedLocation(this.business.locations[0])
    }
  },
  apollo: {
    business: {
      query () {
        return GET_BUSINESS_BY_ID
      },
      variables () {
        const { id } = this
        return { id }
      },
      update (data) {
        return data.business[0]
      }
    }
  }
}
</script>
