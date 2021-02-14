<template>
  <main v-if="business">
    <section class="flex justify-between items-center mb-4 align-middle">
      <h1 class="text-2xl">Add Business</h1>
      <router-link to="/owner" class="border border-gray-600 px-6 py-2 rounded inline-block mb-2">Go Back</router-link>
    </section>
    <div class="flex flex-col md:flex-row border border-gray-600 mb-6 shadow rounded">
      <div class="flex flex-col flex-1 p-6">
        <div
          class="text-center border border-dashed border-gray-600 h-64 p-6
          justify-center flex flex-col items-center cursor-pointer mb-4">
          <span class="text-6xl">&plus;</span>
          <span class="text-lg">Upload an Image</span>
        </div>
        <LabeledInput
          label="Upload an image using a URL:"
          name="image_url"
          required
          type="text"
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
            class="border border-gray-600 rounded text-lg p-2 mb-4"
            placeholder="Tags (e.g. Food)"
            multiple
            :options="all_tags"
            label="name"
            v-model="tags_edit"
          />
        </LabeledField>
        <LabeledField name="territories" label="Tribal, National and Land Affiliations">
          <v-select
            class="border border-gray-600 rounded text-lg p-2 mb-4"
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
      </div>
    </div>
    <div class="flex flex-col justify-end md:flex-row">
      <button
        class="text-green-500 text-white px-6 py-2 mr-4 rounded"
        @click="saveBusiness"
      >Save</button>
      <button class="text-red-500 text-white px-6 py-2 rounded" type="submit">Delete</button>
    </div>
    <h1 class="text-2xl">Business Preview</h1>
    <p class="text-"></p>
    <BusinessCard :business="business_preview"/>
  </main>
</template>
<script>
import BusinessCard from '@/components/BusinessCard'
import LabeledInput from '@/components/business/edit/LabeledInput'
import LabeledField from '@/components/business/edit/LabeledField'

import { mapState } from 'vuex'
import axios from 'axios'

import {
  GET_BUSINESS_BY_ID,
  GET_ALL_TAGS,
  GET_ALL_TERRITORIES,
  SAVE_BUSINESS
} from '@/queries'

const loggedInContext = {
  headers: {
    'x-hasura-role': 'user'
  }
}

export default {
  props: ['id'],
  data () {
    return {
      business: {
        name: null,
        short_description: null,
        long_description: null,
        external_url: null,
        physical_address: '',
        location: {},
        /* Relational */
        tags: [],
        territories: [],
        image_assets: []
      }
    }
  },
  apollo: {
    all_tags: GET_ALL_TAGS,
    all_territories: GET_ALL_TERRITORIES,
    business: {
      query () { return GET_BUSINESS_BY_ID },
      variables () {
        return { id: this.id }
      }
    }
  },
  components: { BusinessCard, LabeledInput, LabeledField },
  computed: {
    ...mapState(['user']),

    business_preview () {
      return this.business
    },
    tags_edit: {
      get () {
        return this.business.tags.map(i => i.tag)
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
    saveBusiness () {
      /* eslint-disable camelcase */
      let { id, name, short_description, long_description, external_url, tags, territories } = this.business
      let business = { name, short_description, long_description, external_url }

      this.$apollo.mutate({
        mutation: SAVE_BUSINESS,
        context: loggedInContext,
        variables: {
          business,
          business_id: id,
          tags: tags.map(({ tag_id, business_id }) => ({ tag_id, business_id })),
          territories: territories.map(({ territory_id, business_id }) => ({ territory_id, business_id }))
        },
        update: (cache, { data }) => {
          const business = data.update_businesses_by_pk.business
          if (business) {
            this.writeBusinessToCache(cache, business)
          }
        }
      })
    },
    async geocode (address) {
      const key = process.env.VUE_APP_GOOGLE_GEOCODE_API_KEY
      const request = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`)
      return request.data.results[0]
    },
    searchLocation (e) {
      if (e.key === 'Enter') {
        this.business.location = this.geocode(this.business.physical_address).formatted_address
      }
    }
  }
}
</script>
