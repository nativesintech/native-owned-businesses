<template>
  <main class="flex flex-col text-left">
    <div class="py-4 flex flex-col">
      <transition name="fade-in-left" tag="div" mode="out-in" appear v-if="business">
        <BusinessCard :business="business" :expanded="true" />
      </transition>
      <div v-if="business.location">
        <h2 class="text-xl text-bold pb-2">
          Locations
        </h2>
        <div
          class="locations flex-row flex overflow-hidden md:flex row border
          border-gray-600 mb-6 shadow rounded h-64"
        >
          <div class="flex-grow flex-1 flex flex-col pad-6">
            <div
              class="flex flex-col"
              :key="business.location.id"
            >
              <div
                class="name p-4 border-gray-600 cursor-pointer border-t z-20
                -m-px transition-colors duration-300 hover:bg-gray-200"

                :class="'border-b border-gray-300 bg-gray-200'"
              >{{business.physical_address}}</div>
              <div class="border-b border-gray-300 flex flex-row z-10" >
                <div class="border-r font-bold px-4 p-2">Address:</div>
                <div class="p-2 text-gray-800 flex-1">
                  {{business.physical_address || 'No Postal Address Provided'}}
                </div>
              </div>
            </div>
          </div>
          <Map
            class="h-full border-l border-gray-600 flex-grow flex-1 z-30"
            :location="business.location"
            :zoom="9"
          />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
import Map from '@/components/business/Map'

import { GET_BUSINESS_BY_ID } from '@/queries'

export default {
  props: ['id'],
  components: { BusinessCard, Map },
  apollo: {
    business: {
      query () {
        return GET_BUSINESS_BY_ID
      },
      variables () {
        const { id } = this
        return { id }
      }
    }
  }
}
</script>
