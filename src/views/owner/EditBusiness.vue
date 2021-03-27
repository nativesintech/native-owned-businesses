<template>
  <main v-if="business">
    <section class="flex justify-between items-center mb-4 align-middle">
      <h1 class="text-2xl">Edit Business</h1>
      <router-link to="/owner" class="border border-gray-600 px-6 py-2 rounded inline-block mb-2">Go Back</router-link>
    </section>
    <div class="flex flex-col md:flex-row border border-gray-600 mb-6 shadow rounded">
      <div class="flex flex-col flex-1 p-6">
        <!--
        <div
          class="text-center border border-dashed border-gray-600 h-64 p-6
          justify-center flex flex-col items-center cursor-pointer mb-4">
          <span class="text-6xl">&plus;</span>
          <span class="text-lg">Upload an Image</span>
        </div>
        -->
        <LabeledInput
          label="Upload an image using a URL:"
          name="image_assets"
          required
          type="text"
          v-model="image_assets_edit"
          placeholder="https://..."
        />
      </div>
      <div class="flex-1 p-6 border-l border-gray-600 flex flex-col">
        <LabeledInput
          label="Business Name"
          name="name"
          required
          type="text"
          placeholder="Example: Mvto Diner"
          v-model="business.name"
        />
        <LabeledInput
          label="Short Description / Blurb"
          name="short_description"
          type="text"
          placeholder="Example: A fast-casual diner"
          v-model="business.short_description"/>
        <LabeledInput
          label="Full Description"
          name="long_description"
          placeholder="A much longer description with more details."
          v-model="business.long_description"
          :textarea="true"
        />
        <LabeledInput
          label="Website URL"
          name="external_url"
          type="text"
          placeholder="https://..."
          v-model="business.external_url"
        />
        <LabeledField name="tags" label="Tags">
          <v-select
            placeholder="Tags (e.g. Food)"
            multiple
            :options="all_tags"
            label="name"
            v-model="tags_edit"
          />
        </LabeledField>
        <LabeledField name="territories" label="Tribal, National, and Land Affiliations">
          <v-select
            placeholder="Tribal affiliation (e.g. Osage)"
            multiple
            :options="all_territories"
            label="name"
            v-model="territories_edit"
          />
        </LabeledField>
        <label class="text-sm text-gray-500 leading-normal mb-2">
          Data courtesy of
          <a
            class="text-blue-500"
            href="https://native-land.ca/"
            target="_blank">Native Land Digital</a>
        </label>

        <LabeledInput
          label="Address"
          name="physical_address"
          type="text"
          placeholder="18 MadeUp Street, Tulsa, Oklahoma"
          class="border-t pt-6 mt-6"
          @keyup="searchLocation"
          v-model="business.physical_address"
        />
        <label class="text-sm text-gray-500 leading-normal mb-2">
          If you have no physical address, you can use a Plus Code
          (<a class="text-blue-500" href="https://support.google.com/maps/answer/7047426">more info</a>),
          or describe the address and move the cursor below to the closest location.
        </label>

        <label v-if="geocodeResult" class="text-sm text-gray-500 leading-normal mb-2">
          Found location: {{geocodeResult.formatted_address}}
          <div
            class=" text-blue-500 cursor-pointer underline"
            @click="setPhysicalAddressToGeocodedAddress"
          >Update Address</div>
        </label>

        <Map
          class="h-64 border-gray-500 border"
          :location="business.location"
          :zoom="9"
        />
      </div>
    </div>
    <div style="min-height: 45px;" class="flex flex-row justify-end items-center md:flex-row">
      <transition name="fade-in-down" mode="out-in" appear>
        <div class="flex flex-col justify-center text-gray-500 mr-4">
          <span style="min-width: 142px;" class="bg-gray-100 text-gray-500 p-2 border-2 border-gray-100 rounded" v-if="saveState == SaveStates.SAVING">Saving...</span>
          <span style="min-width: 142px;" v-else-if="saveState == SaveStates.ERROR" class="bg-red-100 text-red-500 p-2 border-2 border-red-100 rounded">Error saving business.</span>
          <span style="min-width: 142px;" class="bg-green-100 text-green-500 p-2 border-2 border-green-100 rounded" v-else-if="saveState == SaveStates.SUCCESS">Business saved.</span>
        </div>
      </transition>
      <button
        class="text-green-500 px-6 py-2 mr-4 border border-green-500 hover:bg-green-500 hover:text-white transition-colors duration-150 rounded"
        @click="saveBusiness"
      >Save</button>
      <button
        class="text-red-500 text-white py-2 underline hover:no-underline rounded"
        @click="deleteBusiness"
      >Delete</button>
    </div>
    <h1 class="text-2xl">Business Preview</h1>
    <BusinessCard :business="business" />
  </main>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
import LabeledInput from '@/components/ui/LabeledInput'
import LabeledField from '@/components/ui/LabeledField'
import Map from '@/components/business/Map'

import { googleToGeoJSON, filterSpecialTags, SPECIAL_TAG_IDS } from '@/helpers'
import { CONTEXT_LOGGED_IN, SaveStates } from '@/constants'

import { mapState } from 'vuex'
import axios from 'axios'

import {
  GET_BUSINESS_BY_ID,
  GET_ALL_TAGS,
  GET_ALL_TERRITORIES,
  SAVE_BUSINESS,
  DELETE_BUSINESS
} from '@/queries'

export default {
  props: ['id'],
  data () {
    return {
      geocodeResult: null,
      saveState: null,
      SaveStates
    }
  },
  apollo: {
    all_tags: GET_ALL_TAGS,
    all_territories: GET_ALL_TERRITORIES,
    business: {
      context: CONTEXT_LOGGED_IN,
      query () { return GET_BUSINESS_BY_ID },
      variables () {
        return { id: this.id }
      }
    }
  },
  components: { BusinessCard, LabeledInput, LabeledField, Map },
  computed: {
    ...mapState(['user']),

    tags_edit: {
      get () {
        return this.business.tags.filter(filterSpecialTags).map(i => i.tag)
      },
      set (values) {
        this.business.tags = values.map(tag => ({
          business_id: this.business.id,
          tag_id: tag.id,
          tag: tag
        }))
      }
    },
    territories_edit: {
      get () {
        return this.business.territories.map(i => i.territory)
      },
      set (values) {
        this.business.territories = values.map(territory => ({
          business_id: this.business.id,
          territory_id: territory.id,
          territory: territory
        }))
      }
    },
    image_assets_edit: {
      get () {
        return this.business.image_assets.length > 0 ? this.business.image_assets[0].src : undefined
      },
      set (src) {
        this.business.image_assets = [{ src }]
      }
    }
  },
  methods: {
    writeBusinessToCache (cache, business) {
      cache.writeQuery({
        query: GET_BUSINESS_BY_ID,
        data: { business },
        variables: { id: business.id }
      })
    },
    setPhysicalAddressToGeocodedAddress () {
      this.business.physical_address = this.geocodeResult.formatted_address
    },
    async saveBusiness () {
      /* eslint-disable camelcase */
      let { id, name, short_description, long_description, external_url, location, physical_address, tags, territories } = this.business
      let business = { name, short_description, long_description, external_url, location, physical_address }

      tags = tags.filter(filterSpecialTags).map(({ tag_id, business_id }) => ({ tag_id, business_id }))
      territories = territories.map(({ territory_id, business_id }) => ({ territory_id, business_id }))

      this.saveState = SaveStates.SAVING

      try {
        await this.$apollo.mutate({
          mutation: SAVE_BUSINESS,
          context: CONTEXT_LOGGED_IN,
          variables: {
            business_id: id,
            ignore_delete_tags: SPECIAL_TAG_IDS,
            business, tags, territories
          },
          update: (cache, { data }) => {
            const business = data.update_businesses_by_pk.business
            if (business) {
              this.writeBusinessToCache(cache, business)
            }

            this.saveState = SaveStates.SUCCESS
          }
        })
      } catch (e) {
        this.saveState = SaveStates.ERROR
      }
    },
    async deleteBusiness () {
      if (confirm('Are you sure you want to delete this business?')) {
        await this.$apollo.mutate({
          mutation: DELETE_BUSINESS,
          context: CONTEXT_LOGGED_IN,
          variables: {
            business_id: this.business.id
          },
          update: async (cache, { data }) => {
            const routeChange = await this.$router.push({ name: 'owner-home' })
            /* Force re-fetching of businesses after deletion */
            const component = routeChange.matched[0].instances.default
            component.$apollo.queries.businesses.refetch()
          }
        })
      }
    },
    async geocode (address) {
      const key = process.env.VUE_APP_GOOGLE_GEOCODE_API_KEY
      const request = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`)
      return request.data.results[0]
    },
    async searchLocation (e) {
      if (e.key === 'Enter') {
        const geocode = await this.geocode(this.business.physical_address)
        this.geocodeResult = geocode
        this.business.location = googleToGeoJSON(geocode.geometry)
      }
    }
  }
}
</script>
